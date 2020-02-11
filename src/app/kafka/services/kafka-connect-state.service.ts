import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {KafkaConnector} from '../../models/Kafka';

/**
 * State used in the KafkaConnectModule.
 *
 * How to use it:
 * - Component.constructor: Inject KafkaConnectState
 * - Component.ngOnInit: subscribe to Observable object
 * - Component.ngOnDestroy: unsubscribe from Observable to prevent memory leak
 */
@Injectable()
export class KafkaConnectState {

  private updatedConnector = new Subject<KafkaConnector>();
  updatedConnector$ = this.updatedConnector.asObservable();

  connectorUpdated(connector: KafkaConnector): void {
    console.debug(`Connector '${connector.name}' updated from backend`);
    this.updatedConnector.next(connector);
  }
}
