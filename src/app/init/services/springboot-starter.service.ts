import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {properties} from '../../../environments/environment';
import {Starter} from '../../models/Starter';

@Injectable({
  providedIn: 'root'
})
export class SpringbootStarterService {

  constructor(private http: HttpClient) { }

  getSpringStarter(): Observable<Starter> {
    // Added timestamp in the request to avoid the response being cached by the browser for a week
    // See https://github.com/spring-io/initializr/issues/979
    return this.http.get<Starter>(
      `${properties.springStarterUrl}/uoa-springboot-starter/?t=${new Date().getTime()}`);
  }

  generate(params: any): Observable<Starter> {
    const options = { params: params, responseType: 'arraybuffer' as 'json'};
    console.log('Generating starter Project' , options);
    return this.http.get<Starter>(
      `${properties.springStarterUrl}/uoa-springboot-starter/starter.zip`, options );
  }
}
