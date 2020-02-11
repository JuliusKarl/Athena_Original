import {Component, OnDestroy, OnInit} from '@angular/core';
import {KafkaConnectService} from '../../services/kafka-connect.service';
import {KafkaConnector, KafkaConnectorStatus, KafkaConnectorHealth, KafkaConnectorTaskStatus} from '../../../models/Kafka';
import {KafkaConnectState} from '../../services/kafka-connect-state.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-kafka-connectors',
  templateUrl: './kafka-connectors.component.html',
  styleUrls: ['./kafka-connectors.component.css']
})

export class KafkaConnectorsComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[];
  searchText: string;
  loading = true;
  errorWhileLoading = false;
  connectorMap: Map<string, KafkaConnector[]>;

  constructor(private kafkaConnectService: KafkaConnectService,
              private state: KafkaConnectState) {
  }

  ngOnInit() {
    this.getConnectors();
    this.subscriptions = this.subscribeToState();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getConnectors(): void {
    this.errorWhileLoading = false;
    this.loading = true;
    this.kafkaConnectService.getConnectors()
      .subscribe(
        connectors => {
          this.connectorMap = connectors.reduce(( m , connector ) => {
              m[connector.type] = m[connector.type] || [];
              m[connector.type].push(connector);
              return m;
          }, Object.create(null));
          this.loading = false;
        },
        error => {
          console.debug('kafka-connectors-component: Unable to get kafka connectors');
          this.errorWhileLoading = true;
          this.loading = false;
        }
      );
  }

  refreshList(): void {
    this.getConnectors();
  }

  getStateClass(connector: KafkaConnector) {
    let finalState: String;
    finalState = 'status-green';
    for (const task of connector.health.tasks) {
      if (task.state == KafkaConnectorTaskStatus.PAUSED && finalState != KafkaConnectorTaskStatus.FAILED) {
        finalState = 'status-yellow';
        }
      else if (task.state == KafkaConnectorTaskStatus.FAILED) {
        finalState = 'status-red';
      }
    }
    return finalState;
  }

  subscribeToState(): Subscription[] {
    const sub = this.state.updatedConnector$.subscribe(updatedConnector => {

      if (!this.connectorMap) {
        return;
      }

      console.debug(`kafka-connectors-component: Updating connector UI for ${updatedConnector.name}`);
      const connectors = this.connectorMap[updatedConnector.type];

      if (updatedConnector.health.state === KafkaConnectorStatus.DELETED ) {
        // Connector is deleted remove from list
        this.connectorMap[updatedConnector.type] = connectors
          .filter((c) => c.name !== updatedConnector.name);
      } else {
        // Update the right connector (filter by name)
        const existingConnector = connectors
          .filter((c) => c.name === updatedConnector.name)
          .pop();

        existingConnector.name = updatedConnector.name;
        existingConnector.health = updatedConnector.health;
        existingConnector.config = updatedConnector.config;
        existingConnector.type = updatedConnector.type;
      }


    });

    return [sub];
  }
}
