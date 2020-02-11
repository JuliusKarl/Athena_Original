import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  KafkaConnector,
  KafkaConnectorAction,
  KafkaConnectorStatus,
  KafkaConnectorTask,
  KafkaConnectorTaskAction
} from '../../../models/Kafka';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {KafkaConnectService} from '../../services/kafka-connect.service';
import {KafkaConnectState} from '../../services/kafka-connect-state.service';
import {KibanaService} from '../../../common/services/kibana.service';
import {properties} from '../../../../environments/environment';
import {ConfirmDialog} from '../../../models/ConfirmDialog';
import {ConfirmDialogService} from '../../../common/services/confirm-dialog.service';
import {EnvService} from '../../../common/services/env.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-kafka-connector',
  templateUrl: './kafka-connector.component.html',
  styleUrls: ['./kafka-connector.component.css']
})
export class KafkaConnectorComponent implements OnInit, OnDestroy {

  connectorName: string;
  targetApplication: string;
  connector: KafkaConnector;
  taskError: KafkaConnectorTask;
  taskLoadProgress = null;
  connectorLoadProgress = null;
  connectorIcon = 'save_alt';
  subscriptions: Subscription[];
  CONNECTOR_PREFIX = 'connection-';
  APPLICATION_PREFIX = 'integration-';
  apiLogUrl: string;
  connectorLogUrl: string;

  constructor(private kafkaConnectService: KafkaConnectService,
              private state: KafkaConnectState,
              private router: Router,
              private route: ActivatedRoute,
              private kibanaService: KibanaService,
              private confirmDialogService: ConfirmDialogService) {
  }


  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.connectorName = params.get('connectorName');
        this.targetApplication = this.getTargetApplication(this.connectorName);
        this.apiLogUrl = this.kibanaService.constructKibanaLink('apiLogFilter',
          {apiName: this.targetApplication, environ: properties.env});
        this.connectorLogUrl = this.kibanaService.constructKibanaLink('connectorlogFilter',
          {connectorName: this.connectorName, environ: properties.env});
        this.refresh();
      }
    );
    this.subscriptions = this.subscribeToState();
  }

  getTargetApplication(connectorName: string): string {
    if (connectorName.startsWith(this.CONNECTOR_PREFIX)) {
      return connectorName.replace(this.CONNECTOR_PREFIX, this.APPLICATION_PREFIX);
    }
    return null;
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  refresh(): void {
    this.connectorLoadProgress = {msg: 'Loading connector info', type: 'info'};
    this.kafkaConnectService.getConnector(this.connectorName).subscribe(
      connector => {
        this.state.connectorUpdated(connector);
        this.connectorLoadProgress = null;
      },
      error => {
        console.error('Unable to get kafka connector ' + this.connectorName);
        this.connectorLoadProgress = {msg: 'Error loading connector info', type: 'error'};
      });
  }

  getStateClass(state: String): string {
    if (state === 'RUNNING') {
      return 'success';
    } else if (state === 'PAUSED') {
      return 'warning';
    } else {
      return 'error';
    }
  }

  showError(task: KafkaConnectorTask): void {
    this.taskError = task;
  }

  hideError(): void {
    this.taskError = null;
  }

  deleteConnectorDialog() {
    let  dialogConfig: ConfirmDialog;
    dialogConfig = {
      title: 'Delete Connector',
      message: `Are you sure you want to delete <b>${this.connectorName}</b> connector?`,
      reConfirmPhrase: 'delete me',
      yesButton: 'Delete' , noButton: 'Cancel'
    };

    this.confirmDialogService.showDialog(dialogConfig).subscribe(result => {
      if (result) {
        this.deleteConnector();
      }
    });
  }

  deleteConnector() {
    this.connectorLoadProgress = {msg: 'Deleting connector', type: 'info'};
    this.kafkaConnectService.deleteConnector(this.connectorName)
      .subscribe(
        data => {
          this.connector.health.state = KafkaConnectorStatus.DELETED;
          this.state.connectorUpdated(this.connector);
          this.router.navigate(['/kafka/connect']);
        },
        (error: HttpErrorResponse) => {
          console.error(`Unable to delete connector ${this.connectorName}`, error.error);
          const err = error.error;
          if (err.status === 404) {
            this.connectorLoadProgress = {msg: err.message, type: 'error'};
          } else {
            this.connectorLoadProgress = {msg: 'Error deleting connector', type: 'error'};
          }
        }
      );
  }

  pauseConnector() {
    this.connectorLoadProgress = {msg: 'Pausing connector', type: 'info'};

    this.kafkaConnectService.updateConnectorStatus(this.connectorName, KafkaConnectorAction.PAUSE)
      .subscribe(
        data => {
          this.connectorLoadProgress = null;
          this.refresh();
        },
        error => {
          console.error(`Unable to pause connector ${this.connectorName}`);
          this.connectorLoadProgress = {msg: 'Error pausing connector', type: 'error'};
        }
      );
  }

  resumeConnector() {
    this.connectorLoadProgress = {msg: 'Resuming connector', type: 'info'};

    this.kafkaConnectService.updateConnectorStatus(this.connectorName, KafkaConnectorAction.RESUME)
      .subscribe(
        data => {
          this.connectorLoadProgress = null;
          this.refresh();
        },
        error => {
          console.error(`Unable to resume connector ${this.connectorName}`);
          this.connectorLoadProgress = {msg: 'Error resuming connector', type: 'error'};
        }
      );
  }

  restartTask(taskId: number) {
    this.taskLoadProgress = {msg: `Restarting task ${taskId}`, type: 'info'};
    console.debug(`Calling task ${taskId} restart`);

    this.kafkaConnectService.updateTaskStatus(this.connectorName, taskId, KafkaConnectorTaskAction.RESTART)
      .subscribe(
        data => {
          this.taskLoadProgress = null;
          this.refresh();
        },
        error => {
          console.error(`Unable to restart connector ${this.connectorName} task ${taskId}`);
          this.taskLoadProgress = {msg: `Error Restarting task ${taskId}`, type: 'error'};
        }
      );
  }

  subscribeToState(): Subscription[] {
    const sub = this.state.updatedConnector$.subscribe(updatedConnector => {

      console.debug(`kafka-connector-component: Updating connector UI for ${updatedConnector.name}`);

      this.connector = updatedConnector;
      this.connectorIcon = updatedConnector.type.toLowerCase() === 'sink' ? 'save_alt' : 'space_bar';
    });

    return [sub];
  }

  isNonProd(): boolean {
    return properties.env.toLowerCase() !== EnvService.PRD;
  }
}
