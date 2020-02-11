import {Component, OnInit} from '@angular/core';
import {KafkaConsumer} from '../../../models/Kafka';
import {KafkaService} from '../../services/kafka.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ResetOffsetDialogComponent} from './reset-offset-dialog.component';

export interface ResetOffsetDialogData {
  consumerGroup: string;
  topic: string;
  partition: number;
}

@Component({
  selector: 'app-kafka-consumer',
  templateUrl: './kafka-consumer.component.html',
  styleUrls: ['./kafka-consumer.component.css']
})
export class KafkaConsumerComponent implements OnInit {
  topicName: string = null;
  consumerGroup: string = null;
  consumerLoadProgress = null;
  offsetProgress = null;
  consumers: KafkaConsumer;

constructor(private kafkaService: KafkaService,  private route: ActivatedRoute,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.topicName = params.get('topicName');
        this.consumerGroup = params.get('consumerGroup');
        this.refresh();
      }
    );
  }

  refresh(): void {
    this.consumerLoadProgress = {msg: 'Loading consumer group info', type: 'info'};
    this.offsetProgress = null;
    this.kafkaService.getConsumerDetails(this.consumerGroup).subscribe(
      offsets => {
        this.consumers = offsets;
        this.consumerLoadProgress = null;
      },
      error => {
        console.log('Unable to get consumer group ' + this.consumerGroup);
        this.consumerLoadProgress = {msg: 'Error loading consumer group info', type: 'error'};
      });
  }


  openResetDialog(topic: string, partition: number): void {
    const dialogRef = this.dialog.open(ResetOffsetDialogComponent, {
      width: '650px',
      data: {consumerGroup: this.consumerGroup, topic: topic, partition: partition}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }
}
