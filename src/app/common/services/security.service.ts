import {Injectable} from '@angular/core';
import {properties} from '../../../environments/environment';
import {EnvService} from './env.service';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private envService: EnvService,
              private userService: UserService) { }


  /**
   * Restrict access to DEV and TEST for NON Administrators
   *
   */
  nonProdAdminOnly(): boolean {
    if (this.userService.getCurrentUser().admin) {
      return true;
    } else if (properties.env === EnvService.DEV  || properties.env === EnvService.TST) {
      console.log('Only administrators can access this feature in DEV and TEST');
      return false;
    }
    return true;
  }

}
