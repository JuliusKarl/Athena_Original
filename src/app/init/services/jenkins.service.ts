import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {properties} from '../../../environments/environment';
import {BuildDetails, JobDetails, QueueDetails} from '../../models/Jenkins';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JenkinsService {

  constructor(private http: HttpClient) { }

  triggerTemplateJob(appName: string): Observable<BuildDetails> {
    console.log('Triggering jenkins template pipeline ');
    return this.http.post<BuildDetails>(`${properties.athenaApi}/jenkins/jobs/template/trigger/${appName}`, null);
  }

  getJenkinsQueue(queueId: number): Observable<QueueDetails> {
    console.log('Getting jenkins queue details ', queueId);
    return this.http.get<QueueDetails>(`${properties.athenaApi}/jenkins/queues/${queueId}`);
  }

  checkPipelineExist(repoProject: string, appName: string): Observable<JobDetails> {
    const fullProjectName = `/API/job/${repoProject}/job/${appName}-build-deploy/`
    return this.http.get<JobDetails>(`${properties.athenaApi}/jenkins/jobs/exists?fullProjectName=${fullProjectName}`);
  }
}
