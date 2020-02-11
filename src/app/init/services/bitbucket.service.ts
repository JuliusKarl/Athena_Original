import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {properties} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {RepoDetails} from '../../models/Bitbucket';

@Injectable({
  providedIn: 'root'
})
export class BitbucketService {

  constructor(private http: HttpClient) { }

  getRepoDetails(repoName: string): Observable<RepoDetails> {
    console.log('Fetching repository details for ', repoName);
    return this.http.get<RepoDetails>(`${properties.athenaApi}/bitbucket/repositories/${properties.repoTeam}/${repoName}`);
  }
}
