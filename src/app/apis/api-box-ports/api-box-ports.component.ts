import { Component, OnInit } from '@angular/core';
import {ApiService} from '../services/api.service';

@Component({
  selector: 'app-api-box-ports',
  templateUrl: './api-box-ports.component.html',
  styleUrls: ['./api-box-ports.component.css']
})
export class ApiBoxPortsComponent implements OnInit {
  apiPorts: any[];
  searchText: string;
  loadingApiPort = false;
  loadingApiPortErr = false;
  constructor(private apiService: ApiService) {
    this.loadingApiPort=true;
    this.apiService.getApiPortsMap().subscribe(data => {
      if(data !== undefined){
        this.apiPorts = Array.from(data.values()).sort((val1, val2) => {
          return val1['port'] - val2['port'];
        });
        console.log('Received api ports map', this.apiPorts);
        this.loadingApiPort = false;
      }
    }, error => {
      this.loadingApiPortErr = true;
      this.loadingApiPort = false;
    });
  }

  ngOnInit() {
  }

}
