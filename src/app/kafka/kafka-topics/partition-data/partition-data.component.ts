import { Component, OnInit, Inject} from '@angular/core';
import {KafkaService} from '../../services/kafka.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {KafkaPartitionData} from '../../../models/Kafka';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-partition-data',
  templateUrl: './partition-data.component.html',
  styleUrls: ['./partition-data.component.css']
})
export class PartitionDataComponent implements OnInit {

  partition: number;
  topicName: string;
  partitionData: KafkaPartitionData[];
  partitionLoadProgress = null;
  startFromOffset = -1;
  starting = 'latest';
  showOffsetInput = false;
  startOffset: string;
  searchText: string;
  sortDirection = 'desc';
  sortIcon = 'arrow_drop_down';

  constructor(private kafkaService: KafkaService, private route: ActivatedRoute, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.route.parent.paramMap.subscribe(
      (params: ParamMap) => {
        this.topicName = params.get('topicName');
      }
    );

    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.partition = +params.get('partition');
        this.fetchData();
      }
    );
  }

  openSnackBar(message: string, val: string) {
    this.snackBar.open(message, null, {
       duration: 1500,
    });
    const selBox = document.createElement('textarea');
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
 } 

  fetchData(): void {
    this.partitionLoadProgress = {msg: 'Loading partition data', type: 'info'};
    this.kafkaService.getPartitionData(this.topicName, this.partition, this.startFromOffset).subscribe(
      data => {
        this.partitionData = data;
        this.partitionLoadProgress = null;
      },
      error => {
        console.log('Unable to get data for ' + this.partition);
        this.partitionLoadProgress = {msg: 'Error loading partition data', type: 'error'};
      });
  }

  setOffset(val: string): void {
    this.starting = val;
    if (this.starting === 'offset') {
      this.showOffsetInput = true;
      if (this.startOffset) {
        this.startFromOffset = parseInt(this.startOffset, 0);
        this.sortDirection = 'asc';
        this.setSortIcon();
        this.fetchData();
      }
    } else {
      this.showOffsetInput = false;
      this.startFromOffset = this.starting === 'latest' ? -1 :  0;
      this.sortDirection = this.starting === 'latest' ? 'desc' : 'asc';
      this.setSortIcon();
      this.startOffset = null;
      this.fetchData();
    }
  }

  toggleDirection(): void {
    this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
    this.setSortIcon();
  }
  setSortIcon(): void {
    this.sortIcon = this.sortDirection === 'desc' ? 'arrow_drop_down' : 'arrow_drop_up';
  }
}
