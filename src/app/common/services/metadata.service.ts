import {Injectable} from '@angular/core';
import {RawApp, ServiceNowQueue} from '../../models/App';
import {properties} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EnterpriseApp} from '../../models/Starter';
import {AppRegisterRequest, AppRegistrationResponse} from '../../models/AppRegisterRequest';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  constructor(private http: HttpClient) {
  }

  getApps(): Observable<RawApp[]> {
    console.log('Getting all applications');
    return this.http.get<RawApp[]>(`${properties.athenaApi}/metadata/applications`);
  }

  getAppBom(appName: string): Observable<RawApp> {
    console.log('Finding ', appName);
    return this.http.get<RawApp>(
      `${properties.athenaApi}/metadata/applications/${appName}`);
  }

  searchApp(searchText: string): Observable<string[]> {
    console.log('searching ', searchText);
    return this.http.get<string[]>(
      `${properties.athenaApi}/metadata/search/?q=${searchText}`);
  }

  getCoreApps(): Observable<string[]> {
    console.log('getting core apps ');
    return this.http.get<string[]>(
      `${properties.athenaApi}/metadata/coreApps`);
  }

  getValueGroups(): Observable<string[]> {
    console.log('getting value groups ');
    return this.http.get<string[]>(
      `${properties.athenaApi}/metadata/app-owners-groups`);
  }

  getServiceNowGroups(): Observable<ServiceNowQueue[]>  {
    console.log('getting service now groups ');
    return this.http.get<ServiceNowQueue[]>(
      `${properties.athenaApi}/metadata/serviceNowGroups`);
  }

  getEnterpriseApps(): Observable<EnterpriseApp[]> {
    console.log('getting Enterprise Apps ');
    return this.http.get<EnterpriseApp[]>(
      `${properties.athenaApi}/metadata/enterpriseApps`);
  }

  registerApp(app: AppRegisterRequest): Observable<AppRegistrationResponse> {
    console.log(`Registering application ${app.appName}`);
    return this.http.post<AppRegistrationResponse>(`${properties.athenaApi}/metadata/register`, app);
  }

}
