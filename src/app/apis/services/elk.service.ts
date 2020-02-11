import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EnvService} from '../../common/services/env.service';
import {properties} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {ElkStatResponse} from '../../models/ElkStatResponse.type';
import {ConsumptionQueryByConsumer} from '../../models/ConsumptionQueryByConsumer';

@Injectable({
  providedIn: 'root'
})
export class ElkService {
    aggQuery = {query: { bool: {must: []}}};


   constructor(private http: HttpClient, private envService: EnvService) {}

  getStats( apiName: string): Observable<any[]> {
      console.log('get Stats for ', apiName);
      this.setStatQuery(apiName );
      return this.http.post( properties.elkApiUrl + '/_search', JSON.stringify(this.aggQuery))
        .pipe(map(( result: ElkStatResponse) => {
          console.log(result);
          let consumption: any[];
          consumption = result.aggregations.total_usage.buckets;
           return consumption;
        }));

  }

  setStatQuery(apiName) {
    this.aggQuery = ConsumptionQueryByConsumer;
    this.aggQuery.query.bool.must[3].wildcard['host'] = '*' + properties.env + '*';
    this.aggQuery.query.bool.must[4].match_phrase['kong.api.name'] = apiName;
    console.log(this.aggQuery );
  }
}
