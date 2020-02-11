import { Injectable } from '@angular/core';
import {kibanaFilters, properties} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KibanaService {

  constructor() { }

  public constructKibanaLink(filterName: string, placeholders: any): string {
    let kibanaQueryUrl = properties.kibanaUrl + '?' +  kibanaFilters[filterName];
    for (const key of Object.getOwnPropertyNames(placeholders)) {
      kibanaQueryUrl = kibanaQueryUrl.replace(key, placeholders[key]);
    }
    return kibanaQueryUrl;
  }
}
