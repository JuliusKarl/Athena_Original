import {Component, OnInit} from '@angular/core';
import {KongService} from '../services/kong.service';
import {ElkService} from '../services/elk.service';


@Component({
  selector: 'app-api-consumers',
  templateUrl: './api-consumers.component.html',
  styleUrls: ['./api-consumers.component.css']
})
export class ApiConsumersComponent implements OnInit{
  loadingConsumers = false;
  loadingConsumersErr = false;
  apiName: string;
  hasConsumers: boolean;
  consumers: any[] = [];
  consumerStats = {};
  summaryStats = {total: 0, thisMonth: 0, lastMonth: 0, beforeLastMonth: 0};
  constructor(private kongService: KongService, private elkService: ElkService) {
  }

  ngOnInit(): void {
  }

  loadApiConsumers(apiName, groups) {
    console.log('apiName , groups ' , apiName, groups);
    this.apiName = apiName;
    this.hasConsumers = groups.length > 0;
    this.getApiConsumption(apiName);
    this.consumers = [];
    groups.forEach(group => {
      this.getApiConsumers(group);
    })
  }

  getApiConsumers(group) {
    console.log('getApiConsumers for ', group);
    this.kongService.getApiConsumer(group).subscribe((data: any)  => {
      console.log('consumers' , data);
      if (this.consumers.length > 0) {
        this.consumers.concat(data);
      } else {
        this.consumers = data;
      }
    });
  }

  getApiConsumption(apiName) {
    console.log('Consumption for ', apiName);
    this.consumerStats = {};
    this.summaryStats = { total: 0, thisMonth: 0, lastMonth: 0, beforeLastMonth: 0};
    if (!this.hasConsumers) {
      this.consumers = [];
    }
    this.loadingConsumers = true;
    this.loadingConsumersErr = false;
    this.elkService.getStats(apiName).subscribe( buckets => {
      this.loadingConsumers = false;
      buckets.forEach(bucket => {
        const thisMonth = bucket.time_usage.buckets[2].doc_count;
        const lastMonth = bucket.time_usage.buckets[1].doc_count;
        const beforeLastMonth = bucket.time_usage.buckets[0].doc_count;
        const total = thisMonth + lastMonth + beforeLastMonth;

        this.summaryStats.total +=  total;
        this.summaryStats.thisMonth +=  thisMonth;
        this.summaryStats.lastMonth +=  lastMonth;
        this.summaryStats.beforeLastMonth +=  beforeLastMonth;
        if (!this.hasConsumers) {
          console.log('consumers ', this.consumers);
          this.consumers.push({name: bucket.key});
        }
        this.consumerStats[bucket.key] = {
          total: total ,
          thisMonth: thisMonth,
          lastMonth: lastMonth,
          beforeLastMonth: beforeLastMonth
        };
      });
      console.log('summary Stats', this.summaryStats);
      console.log('consumer Stats' , this.consumerStats);
    }, error => {
      console.error(error);
      this.loadingConsumersErr = true;
      this.loadingConsumers = false;
    });
  }

}
