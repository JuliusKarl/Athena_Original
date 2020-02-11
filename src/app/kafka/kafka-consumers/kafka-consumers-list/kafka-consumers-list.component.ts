import { Component, OnInit } from '@angular/core';
import {KafkaService} from '../../services/kafka.service';

@Component({
  selector: 'app-kafka-consumers-list',
  templateUrl: './kafka-consumers-list.component.html',
  styleUrls: ['./kafka-consumers-list.component.css']
})
export class KafkaConsumersListComponent implements OnInit {

  allConsumers: string[];
  consumers: string[];
  loading = true;
  errorWhileLoading = false;
  searchText: string;
  showSystemConsumers = false;

  constructor(private kafkaService: KafkaService) { }

  ngOnInit() {
    this.listConsumers();
  }

  listConsumers(): void {
    this.loading = true;
    this.kafkaService.getConsumers().subscribe(
      consumers => {
        this.allConsumers = consumers.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));
        this.filterSystemConsumers();
        this.loading = false;
      }, error => {
        console.log('kafka-consumers-component: Unable to get kafka consumers');
        this.errorWhileLoading = true;
        this.loading = false;
      });
  }

  filterSystemConsumers(): void {
    if (this.showSystemConsumers) {
      this.consumers = this.allConsumers;
    }
    else {
      this.consumers = this.allConsumers.filter( consumer =>  !consumer.startsWith('_'));
    }
  }

  toggleSystemConsumers(): void {
    this.showSystemConsumers = !this.showSystemConsumers;
    this.filterSystemConsumers();
  }
}
