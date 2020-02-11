import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {properties} from '../../../environments/environment';
import {IntegrationApi, KafkaConnector, KafkaConnectorAction, KafkaConnectorsSummary, KafkaConnectorTaskAction} from '../../models/Kafka';
import {Guid} from '../../common/guid/guid';
import {AthenaRequestInteceptorService} from '../../common/interceptors/athena-request.inteceptor.service';

@Injectable({
  providedIn: 'root'
})
export class KafkaConnectService {

  constructor(private http: HttpClient) { }

  getConnectorsSummary(): Observable<KafkaConnectorsSummary> {
    return this.http.get<KafkaConnectorsSummary>(
      `${properties.athenaApi}/connect/info`);
  }

  getConnectors(): Observable<KafkaConnector[]> {
    return this.http.get<KafkaConnector[]>(
      `${properties.athenaApi}/connect`);
  }

  getConnector(connectorName: string): Observable<KafkaConnector> {
    return this.http.get<KafkaConnector>(
      `${properties.athenaApi}/connect/${connectorName}`);
  }

  getIntegrationUrlByApiName(apiName: string): Observable<IntegrationApi> {
    return this.http.get<IntegrationApi>(
      `${properties.athenaApi}/connect/${apiName}/integration-url`);
  }

  deleteConnector(connectorName: string): Observable<Object> {
    return this.http.delete(
      `${properties.athenaApi}/connect/${connectorName}`);
  }

  updateConnectorStatus(connectorName: string, newState: KafkaConnectorAction): Observable<Object> {
    return this.http.put<Object>(
      `${properties.athenaApi}/connect/${connectorName}/${newState.toLocaleString()}`,
      null);
  }

  updateTaskStatus(connectorName: string, taskId: number, newState: KafkaConnectorTaskAction): Observable<Object> {
    return this.http.put<Object>(
      `${properties.athenaApi}/connect/${connectorName}/tasks/${taskId}/${newState.toLocaleString()}`,
      null);
  }

  /**
   * Post Messages to a Kafka Connect Integration API via Athena Backend
   * @param connectorName name of the Kafka Connector
   * @param messages New line delimited string that represents the messages to post
   * @param topicName name of the topic that the message is supposed to come from
   * @return the request as an Observable and the trace id sent as part of the request
   */
  postMessages(connectorName: string, messages: string, topicName: string): [Observable<Object>, string] {

    const traceId = Guid.newGuid();

    const response = this.http.post<Object>(
      `${properties.athenaApi}/connect/${connectorName}/send-messages`,
      messages,
      this.getHeaders('text/plain', topicName, traceId));

    return [response, traceId];
  }

  checkIntegrationApiPayload(apiname: string, request, topicName: string): Observable<Object> {

    console.log('Check integration payload for ', request.url, apiname);
    return this.http.post(
      `${properties.athenaApi}/payloads/${apiname}/check-payload`,
      request, { observe: 'response', responseType: 'text'});
  }

  private getHeaders(contentType = 'application/json', topicName: string, traceId?: string) {

    const headers = {};

    headers['Content-Type'] = contentType;
    headers['X-Kafka-Topic'] = topicName;

    if (traceId) {
      headers[AthenaRequestInteceptorService.HEADER_TRACE_ID] = traceId;
    }

    return {headers};
  }

}
