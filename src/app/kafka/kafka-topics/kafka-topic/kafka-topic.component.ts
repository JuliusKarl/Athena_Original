import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {KafkaService} from '../../services/kafka.service';
import {KafkaConsumer, KafkaPartition} from '../../../models/Kafka';
import {Observable} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-kafka-topic',
  templateUrl: './kafka-topic.component.html',
  styleUrls: ['./kafka-topic.component.css']
})
export class KafkaTopicComponent implements OnInit {

  topicDropdown: boolean = false;
  partitionDropdown: boolean = true;
  messageDropdown: boolean = false;

  topicName: string = null;
  partitionSelected = false;
  selectedPartition: number;

  partitions: KafkaPartition[];
  consumers: KafkaConsumer[];

  topicLoadProgress = null;
  consumersLoadProgress = null;

  constructor(private kafkaService: KafkaService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.topicName = params.get('topicName');
        this.refreshConsumers();
        this.refreshTopics();

        // Check if a partition is already selected based on the URL
        const activeChild = this.route.children.length;
        if (activeChild) {
          this.partitionSelected = true;
          this.route.firstChild.paramMap.subscribe(
            (childParams: ParamMap) => {
              this.selectedPartition = parseInt(childParams.get('partition'), 0);
            }
          );
        } else {
          this.partitionSelected = false;
        }
      }
    );


  }
  
  showList(panel) {
    panel == 'topicDropdown' ? this.topicDropdown = !this.topicDropdown : this.partitionDropdown = !this.partitionDropdown;
  }

  showMessage() {
    this.messageDropdown = true;
  }

  refreshTopics(): void {
    this.messageDropdown = false;
    this.partitionDropdown = true;

    this.topicLoadProgress = {msg: 'Loading topic information', type: 'info'};

    this.kafkaService.getTopicDetails(this.topicName).subscribe(
      (partitions: KafkaPartition[]) => {
        this.partitions = partitions;
        this.topicLoadProgress = null;
      },
      error => {
        console.log('Unable to get kafka connector ' + this.topicName);
        this.topicLoadProgress = {msg: 'Error when loading topic information', type: 'error'};
      });
  }

  refreshConsumers(): void {
    this.consumersLoadProgress = {msg: 'Loading consumers information', type: 'info'};

    this.kafkaService.getConsumersByTopic(this.topicName).subscribe(
      (consumers: KafkaConsumer[]) => {
        this.consumers = consumers;
        this.consumersLoadProgress = null;
      },
      (error: HttpErrorResponse) => {
        console.log('Unable to get kafka consumers of topic ' + this.topicName);
        this.consumersLoadProgress = {msg: 'Error when loading consumers', type: 'error'};
      }
    );
  }
  selectPartition(partition: number): void {
    this.selectedPartition = partition;
    this.partitionSelected = true;
    this.showMessage();
  }

  fetchConsumers(topic: string): Observable<KafkaConsumer[]> {
    console.log(`Get consumers for ${topic} `);
    return this.kafkaService.getConsumersByTopic(topic);
  }
}
