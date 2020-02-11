import {Injectable} from '@angular/core';
import {APIResponse} from '../../models/APIResponse.type';
import {KongService} from './kong.service';
import {EnvService} from '../../common/services/env.service';
import {properties} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    activeGroup: string;
    activeAPiId: string;
    apiMap: Map<string, any>;
    private apiPortsMapSub: BehaviorSubject<any> = new BehaviorSubject(undefined);
    private activeApi: BehaviorSubject<any> = new BehaviorSubject({name: 'Loading...', isProxy: false, group: {}} );

    constructor(private kongService: KongService, private envService: EnvService, private http: HttpClient ) {}

    getApiPortsMap() {
      console.log('getApiPortsMap');
      return this.apiPortsMapSub.asObservable();
    }

    getActiveApi(group, id): Observable<Object> {
      console.log('getActiveApi ' , group, id);
      this.activeGroup = group;
      this.activeAPiId = id;
      if (this.apiMap) {
        return of(this.fetchActiveApi());
      }
      else {
        return this.kongService
          .getKongApi(id)
          .pipe(map(data => {
            return {
              name: data["name"],
            };
          }));
      }
    }

    private fetchActiveApi(): any {
      if (this.activeGroup && this.activeAPiId) {
        const activeGroup = this.apiMap.get(this.activeGroup);
        const api = activeGroup.endpoints.find(apiObj => {
          return apiObj.id === this.activeAPiId;
        });
        if (api) {
          const activeApi = {
            name: api.name,
            isProxy: api.isProxy,
            group: this.apiMap.get(this.activeGroup)
          };
          return activeApi;
        }
        return null;
      }
      return null;
    }

    groupApis(): Observable<Object> {
      console.log('groupApis');
      return this.kongService.getKongApis()
          .pipe(map((result: APIResponse) => {
              this.apiMap = new Map<string, any>();
              const apiPortsMap = new Map<string, any>();
              const response = result.data;
              for (const entry of response) {
                if (entry.name.indexOf('subscriber') === -1) {
                  const key = entry.uris[0].replace('/specs', '').split('/')[1];
                  let group = this.apiMap.get(key);
                  if (group) {
                    group['endpoints'].push(entry);
                  } else {
                    group = {name: key, isProxy: false, hasSpecs: false, hasHealth: false};
                    group['endpoints'] = [];
                    group['endpoints'].push(entry);
                  }
                  entry['isProxy'] = false;
                  const upstream = entry['upstream_url'];
                  let host = upstream.substr(0, upstream.lastIndexOf(':'));
                  if (host === 'http' || host === 'https') {
                    host = upstream;
                  }

                  const port = upstream.substr(upstream.lastIndexOf(':') + 1 , upstream.indexOf('/') - 1 );
                  if (host.indexOf('auckland.ac.nz') === -1) {
                    entry['isProxy'] = true;
                  } else if (!isNaN(port)) {
                    apiPortsMap.set(port, {'port': port, 'api': key});
                  }
                  this.checkStandardEndpointPresence(entry, group);
                  group.endpoints = group.endpoints.sort((val1, val2) => this.sortAlpha(val1.name, val2.name));
                  this.apiMap.set(key, group);
                }
              }
              console.log('groupApis', this.apiMap);
              console.log('apiPortsMap', apiPortsMap);
              this.activeApi.next(this.fetchActiveApi());
              this.apiPortsMapSub.next(apiPortsMap);
              // console.log('apiMap ',this.apiMap);
              return Array.from(this.apiMap.values()).sort((val1, val2) => this.sortAlpha(val1.name, val2.name));
            }),
            catchError(error => {
                console.error(error);
                this.apiPortsMapSub.error(error);
                this.activeApi.error(error);
                throw new Error('Error occured in grouping Apis');
              })
          );
    }

    sortAlpha(value1, value2) {
      const val1 = value1.toUpperCase();
      const val2 = value2.toUpperCase();
      if (val1 < val2) {
          return -1;
      } else if (val1 > val2) {
        return 1;
      }
      return 0;
    }

    checkStandardEndpointPresence(apiObj, group) {
      const api = apiObj.name;

      if (api.indexOf('health') > -1) {
        group['hasHealth'] = true;
      }
      else if (api.indexOf('spec') > -1) {
        group['hasSpecs'] = true;
        const specDocName = apiObj.name.replace('-spec', '') + '-docs';
        group['specs'] = properties.specsUrl.replace('{env}', this.envService.getEnvDomain()) + '/' + specDocName;
      }
      group.isProxy = group.isProxy ? group.isProxy : apiObj.isProxy;
    }

  checkIntegrationApiPayload(apiname, url, payload): Observable<Object> {
    const checkPayloadRequest: any = {
      'url': url,
      'sourcePayload': payload
    };
    console.log('Check payload for ', url);
    return this.http.post(
      `${properties.athenaApi}/payloads/${apiname}/check-payload`,
      checkPayloadRequest,
      {
        responseType: 'text'
      }
    );
  }
}
