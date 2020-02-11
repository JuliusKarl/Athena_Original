import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiConsumersComponent} from '../api-consumers/api-consumers.component';
import {KongService} from '../services/kong.service';
import {ApiService} from '../services/api.service';

@Component({
  selector: 'app-api-plugins',
  templateUrl: './api-plugins.component.html',
  styleUrls: ['./api-plugins.component.css']
})
export class ApiPluginsComponent implements OnInit {
  @ViewChild(ApiConsumersComponent, {static: false}) consumerComp: ApiConsumersComponent;
  plugins = null;
  activeApi: any = {name: 'Loading...', isProxy: false, group: {}} ;
  apiIcon: string = null;
  apiIconToolTip: string = null;
  constructor(private kongService: KongService, private route: ActivatedRoute, private apiService: ApiService) {
    this.route.params.subscribe(params => {
      console.log('ApiConsumersComponent', params);
      console.log('Fetching active api - current: ', this.activeApi);
      this.apiService.getActiveApi(params.group, params.apiId).subscribe(data => {
        this.activeApi = data;
        console.log('Received active api ', this.activeApi);
        if (this.activeApi.name !== 'Loading...') {
          this.setApiIcon();
          this.loadApiPlugins(params.apiId);
        }
      });
    });
  }
  ngOnInit() {

  }
  setApiIcon() {
    console.log('setting icons');
    const api = this.activeApi.name || '';
    if (api.indexOf('integration') > -1) {
      this.apiIcon = 'share';
      this.apiIconToolTip = 'Integration endpoint';
    } else if (api.indexOf('health') > -1) {
      this.apiIcon = 'favorite';
      this.apiIconToolTip = 'Health endpoint';
    } else if (api.indexOf('spec') > -1) {
      this.apiIcon = 'description';
      this.apiIconToolTip = 'Specification endpoint';
    } else if (this.activeApi.isProxy) {
      this.apiIcon = 'call_missed_outgoing';
      this.apiIconToolTip = 'Proxy Api (Not on premises)';
    } else {
      this.apiIcon = 'public';
      this.apiIconToolTip = 'Public endpoint';
    }
  }

  loadApiPlugins(apiId) {
    this.kongService.getApiPlugins(apiId).subscribe(data => {
      console.log(data);
      this.plugins = data;
      const groups = this.plugins.acl ? this.plugins.acl.whitelist : [];
      this.consumerComp.loadApiConsumers(this.activeApi.name, groups);
    });
  }
}
