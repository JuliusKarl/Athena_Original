import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {properties} from '../../../environments/environment';
import {User} from '../../models/User';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class UserService {

  private currentUser: User;

  constructor(private http: HttpClient) {
  }

  setCurrentUser(): Observable<{} | User> {
    console.log('backend: Get Current User Accesses');
    return this.http.get<User>(`${properties.athenaApi}/users/currentUser`)
      .pipe(
        map(data => {
          this.currentUser = data;
          return data;
        }),
        catchError(err => {
          console.error(err);
          this.currentUser = new User();
          return of(this.currentUser);
        }),
      );
  }

  /**
   * Returns current currentUser
   *
   * WARN: assumes that this.currentUser has been set
   */
  getCurrentUser(): User {
    if (!this.currentUser) {
      console.error('Current currentUser has not been set. Ensure that the APP_INITIALIZER phase of the Angular application is calling #setCurrentUser()');
    }

    return this.currentUser;
  }

  /**
   * Checks if current currentUser has access to a particular application
   *
   * WARN: assumes that this.currentUser has been set
   */
  hasAccess(accessFor: string): boolean {

    if (!this.currentUser) {
      console.error('Current currentUser has not been set. Ensure that the APP_INITIALIZER phase of the Angular application is calling #setCurrentUser()');
      return false;
    }

    // Get current currentUser and convert the result from Observable<User> to Observable<boolean>
    const hasAccess = this.currentUser.authorizedApps.indexOf(accessFor) > -1;

    if (this.currentUser.admin === true) {
      return true;
    }

    return hasAccess;
  }
}
