import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {APIResponse} from '../../models/APIResponse.type';
import {ACLResponse, ConsumerData} from '../../models/ACLResponse.type';
import {properties} from '../../../environments/environment';
import {EnvService} from '../../common/services/env.service';


@Injectable({
  providedIn: 'root'
})
export class KongService {

  constructor(private http: HttpClient) {}


  getKongApis(): Observable<Object> {
    return this.http.get(properties.kongApiUrl + '/apis?size=1000');
  }

  getKongApi(apiNameOrId: string): Observable<Object> {
    return this.http.get(properties.kongApiUrl + '/apis/' + apiNameOrId);
  }

  getApiPlugins(apiId): Observable<Object> {
    return this.http.get(properties.kongApiUrl +  '/apis/' + apiId + '/plugins')
      .pipe(map((result: APIResponse) => {
        const apiPlugins = {
          total: result.total,
          acl: null,
          keyAuth: null,
          basic: null,
          oAuth2: null,
          others:[]
        };
        console.log(result);
        result.data.forEach(plugin => {
          this.constructPluginData(apiPlugins, plugin);
        });
        return apiPlugins;
      }));
  }

  private constructPluginData(apiPlugins, plugin): void {

    if (plugin.name === 'acl') {
      apiPlugins.acl = {};
      apiPlugins.acl['whitelist'] = plugin.config.whitelist;
    } else if (plugin.name === 'key-auth') {
      apiPlugins.keyAuth = {};
      apiPlugins.keyAuth['keyNames'] = plugin.config.key_names;
    } else if (plugin.name === 'basic-auth') {
      apiPlugins.basic = {};
    } else if (plugin.name === 'oauth2') {
      apiPlugins.oAuth2 = {};
      apiPlugins.oAuth2['scopes'] = plugin.config.scopes;
    } else {
      apiPlugins.others.push(plugin.name);
    }
  }

  getApiConsumer(group): Observable<Object> {
    return this.http.get(properties.kongApiUrl +  '/acls?group=' + group)
      .pipe(map((result: ACLResponse) => {
        const consumers = [];
        result.data.forEach(consumer => {
          this.getApiConsumerName(consumer.consumer_id).subscribe( (consumerDetails: ConsumerData) => {
            consumers.push({id: consumerDetails.id, name: consumerDetails.username, custom_id: consumerDetails.custom_id});
          });
        })
        return consumers;
      }));
  }

  getApiConsumerName(consumerId): Observable<Object> {
    return this.http.get(properties.kongApiUrl +  '/consumers/' + consumerId);
  }

}
