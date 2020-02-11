import {Injectable} from '@angular/core';
import {properties} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  public static DEV = 'dev';
  public static TST = 'tst';
  public static PRD = 'prd';

  private static ENVIRONMENTS = new Map([
    [ EnvService.DEV, 'Development' ],
    [ EnvService.TST, 'Test' ],
    [ EnvService.PRD, 'Production' ]
  ]);

  constructor() {

  }

  getEnvTitle(): string {
    return EnvService.ENVIRONMENTS.get(properties.env);
  }

  getEnvDomain(): string {
    if (properties.env === EnvService.PRD) {
      return '.';
    } else if (properties.env === EnvService.TST) {
      return '.test.';
    } else {
      return '.dev.';
    }
  }

}
