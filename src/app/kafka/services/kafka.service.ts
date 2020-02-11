import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../../common/services/env.service';
import {Observable, of} from 'rxjs';
import {properties} from '../../../environments/environment';
import {KafkaConsumer, KafkaInfo, KafkaPartition, KafkaPartitionData, ResetOffset, ResetOffsetResponse} from '../../models/Kafka';
import {catchError, map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class KafkaService {

  constructor(private http: HttpClient, private envService: EnvService) { }


  getTopics(): Observable<string[]> {
    return this.http.get<string[]>(
      `${properties.athenaApi}/kafka/topics`);
  }

  getConsumersByTopic(topic: string): Observable<KafkaConsumer[]> {
    return this.http.get<KafkaConsumer[]>(
      `${properties.athenaApi}/kafka/topics/${topic}/consumers`)
      .pipe(
        map( result =>
          result.filter( (consumer: KafkaConsumer) => consumer.consumerName.trim().length > 0)
        )
      );
  }

  getTopicDetails(topicName: string): Observable<KafkaPartition[]> {
    return this.http.get<KafkaPartition[]>(
      `${properties.athenaApi}/kafka/topics/${topicName}/partitions`);
  }

  getConsumers(): Observable<string[]> {
    return this.http.get<string[]>(
      `${properties.athenaApi}/kafka/consumers`)
      .pipe(
        map( result =>
          result.filter( consumer => consumer.trim().length > 0)
        )
      );
  }
  getPartitionData(topicName: string, partition: number, startFromOffset: number): Observable<KafkaPartitionData[]> {
    return this.http.get<KafkaPartitionData[]>(
      `${properties.athenaApi}/kafka/topics/${topicName}/partitions/${partition}/data?startFromOffset=${startFromOffset}`);
  }


  getTopicSampleMessages(topicName: string, partition: number, msgCount: number): Observable<string|string[]> {
    return this.http.get<KafkaPartitionData[]>(
      `${properties.athenaApi}/kafka/topics/${topicName}/partitions/${partition}/data?startFromOffset=-1&maxMsg=${msgCount}`)
      .pipe(map( response => {
        {
          if (response.length > 0) {
            return response.map(item =>  item.message.toString() );
          } else {
            return 'No sample messages found for topic ' + topicName;
          }
        }
      }), catchError( err => {
        console.log('Unable to get sample messages for ' + topicName , err);
        return of('Unable to get sample messages for ' + topicName);
      }));
  }

  getConsumerDetails(consumerGroup: string): Observable<KafkaConsumer> {
    return this.http.get<KafkaConsumer>(
      `${properties.athenaApi}/kafka/consumers/${consumerGroup}/topics`);
  }

  getInfo(): Observable<KafkaInfo> {
    return this.http.get<KafkaInfo>(
      `${properties.athenaApi}/kafka/info`);
  }

  resetOffset(consumerGroup: string, offset: ResetOffset): Observable<ResetOffsetResponse> {
    return this.http.post<ResetOffsetResponse>(`${properties.athenaApi}/kafka/consumers/${consumerGroup}/resetOffset`, offset);
  }
}
