import { Component, OnInit } from '@angular/core';
import {KafkaService} from '../services/kafka.service';
import {KafkaInfo} from '../../models/Kafka';

@Component({
  selector: 'app-kafka-home',
  templateUrl: './kafka-home.component.html',
  styleUrls: ['./kafka-home.component.css']
})
export class KafkaHomeComponent implements OnInit {

  kafkaInfo: KafkaInfo;
  loading = false;
  errorWhileLoading = false;
  constructor(private kafkaService: KafkaService) { }

  ngOnInit() {
    this.loading = true;
    this.kafkaService.getInfo().subscribe(
      info => {
        this.kafkaInfo = info;
        this.setTopicsCount();
        this.setConsumersCount();
      }, error => {
        console.log('Unable to get kafka info');
        this.errorWhileLoading = true;
        this.loading = false;
      }
    );
    this.loading = false;
  }

  setTopicsCount(): void {
    this.kafkaService.getTopics().subscribe(
      topics => {
        this.kafkaInfo.topics = topics.filter(topic => !topic.startsWith('_')).length;
      }
    );
  }

  setConsumersCount(): void {
    this.kafkaService.getConsumers().subscribe(
      consumers => {
        this.kafkaInfo.consumers = consumers.filter(consumer => !consumer.startsWith('_')).length;
      }
    );
  }
}
