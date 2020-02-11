import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {SecurityService} from '../services/security.service';

@Injectable()
export class GuardNonProdAdminOnly implements CanActivate {

  constructor(private securityService: SecurityService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      return this.securityService.nonProdAdminOnly();
  }

}


