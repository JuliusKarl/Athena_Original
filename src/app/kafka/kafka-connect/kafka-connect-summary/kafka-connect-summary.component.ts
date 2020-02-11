import {Component, OnInit} from '@angular/core';
import {KafkaConnectService} from '../../services/kafka-connect.service';
import {KafkaConnectorsSummary} from '../../../models/Kafka';

@Component({
  selector: 'app-kafka-connect-summary',
  templateUrl: './kafka-connect-summary.component.html',
  styleUrls: ['./kafka-connect-summary.component.css']
})
export class KafkaConnectSummaryComponent implements OnInit {

  summary: KafkaConnectorsSummary;
  loading = true;
  errorWhileLoading = false;
  constructor(private kafkaConnectService: KafkaConnectService) { }

  ngOnInit() {
    this.loadData();
  }


  loadData(): void {
    this.loading = true;
    this.kafkaConnectService.getConnectorsSummary().subscribe(
        data => {
          this.summary = data;
          this.loading = false;
      }, error => {
      console.log('Unable to get kafka connectors summary');
      this.errorWhileLoading = true;
      this.loading = false;
    })
  }

}
