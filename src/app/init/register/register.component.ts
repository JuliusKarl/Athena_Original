import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {SpringbootStarterService} from '../services/springboot-starter.service';
import {MetadataService} from '../../common/services/metadata.service';
import {UserService} from '../../common/services/user.service';
import {AppRegisterRequest, AppRegistrationResponse} from '../../models/AppRegisterRequest';
import {FormService} from '../../common/services/form.service';
import {AppType, RawApp, ServiceNowQueue} from '../../models/App';
import {properties} from '../../../environments/environment';
import {BitbucketService} from '../services/bitbucket.service';
import {ProgressIndicator} from '../../models/ProgressIndicator';
import {RepoDetails} from '../../models/Bitbucket';
import {BackendErrorResponse} from '../../models/Common';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../init-layout.component.css']
})
export class RegisterComponent implements OnInit {

  appTypes = [AppType.API, AppType.INTEGRATION];

  @ViewChild('dependencyInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;

  lookupError: string;
  registrationProgress: ProgressIndicator;
  registerForm: FormGroup;
  serviceNowGroups: ServiceNowQueue[] = [];
  valueStreams = [];
  inputAppName: string;
  appName: string;
  isRegistered: boolean;
  isEditMode: boolean;
  registeredApp: RawApp;
  repoUrl = 'https://' + properties.repo + '/' + properties.repoTeam;
  repositoryDetails: RepoDetails;
  repoValidationProgress: ProgressIndicator;
  action = 'Register';

  constructor(private starterService: SpringbootStarterService, private metadataService: MetadataService ,
              private bitbucketService: BitbucketService,
              private userService: UserService, public formService: FormService,
              private route: ActivatedRoute) {

    this.registerForm = new FormGroup({
      repoUrl: new FormControl(''),
      appName: new FormControl(''),
      appType: new FormControl(''),
      valueStream: new FormControl(''),
      serviceQueue: new FormControl('')
    });

    this.setDefaultValueStream();

    this.metadataService.getValueGroups().subscribe(data => this.valueStreams = data.sort(), err => {
      console.log(err);
      this.registrationProgress = new ProgressIndicator('error', 'Unable to get value groups');
    });

    this.metadataService.getServiceNowGroups().subscribe(data => this.serviceNowGroups = data, err => {
      console.log(err);
      this.registrationProgress = new ProgressIndicator('error', 'Unable to get Service now groups');
    });

    // Check if request is for edit and set the app details if so
    this.route.params.subscribe(params => {
      this.inputAppName = params.appName;
      console.log('edit app:', this.inputAppName );
      if (this.inputAppName) {
        this.setAppDetails(this.inputAppName);
      }
    });
  }

  ngOnInit() {
  }

  private setAppDetails(appName: string) {
    console.log('Searching for application ', appName);
    this.isEditMode = true;
    this.action = 'Update';
    this.metadataService.getAppBom(appName).subscribe( (app: RawApp) => {
      console.log(app);
      this.registerForm.get('appName').setValue(app.appName);
      this.registerForm.get('repoUrl').setValue(app.repoUrl);
      this.validateRepoUrl();
      this.registerForm.get('appType').setValue(app.type);
      this.registerForm.get('valueStream').setValue(app.valueStreamGroup);
      this.registerForm.get('serviceQueue').setValue(app.serviceNowQueue);
      console.log(this.registerForm);
    }, (err: HttpErrorResponse) => {
      console.log('Unable to find application');
      if (err.status === 404 ) {
        this.lookupError = `Unable to find application with registration '${this.inputAppName}'`;
      } else {
        this.lookupError =  'Unable to check existing registrations' ;
      }
    });
  }

  public validateRepoUrl() {
    const repoUrlCtrl = this.registerForm.controls['repoUrl'];

    this.appName = null;
    this.repositoryDetails = null;
    this.isRegistered = false;
    this.repoValidationProgress = new ProgressIndicator('info', 'Validating repository url');

    const repositoryParts = repoUrlCtrl.value.split('/');

    if (repositoryParts.length > 4) {

      // Get repository information from Bitbucket
      this.bitbucketService.getRepoDetails(repositoryParts[4]).subscribe(
        (repoDetails: RepoDetails) => {
          this.repositoryDetails = repoDetails;
          if (!this.isEditMode) {
            this.repoValidationProgress.updateProgress('info', 'Checking existing registration');
            this.checkRegistration(repoDetails);
          } else {
            this.processRegistration(repoDetails);
          }
        }, error => {
          console.log(`Failed to validate URL: ${error}`);

          this.repoValidationProgress = null;
          repoUrlCtrl.setErrors({'repoNotFound': {}});
        });
    } else {
      this.repoValidationProgress = null;
      repoUrlCtrl.setErrors({'repoNotFound': {}});
    }
  }

  checkRegistration(repositoryDetails: RepoDetails) {
    const repoUrlCtrl = this.registerForm.get('repoUrl');

    if (repoUrlCtrl.valid) {
      const appName = repositoryDetails.name;

      this.metadataService.getAppBom(appName).subscribe((appDetails: RawApp) => {
        this.registeredApp = appDetails;
        this.repoValidationProgress = null;
        this.isRegistered = true;
      }, (err: HttpErrorResponse) => {

        if (err.status === 404 ) {
          // Application is not yet registered, proceed as set the app name and type
          this.processRegistration(repositoryDetails);
        } else {
          this.repoValidationProgress.updateProgress('error',  'Unable to check existing registrations' );
        }
      });
    }
  }

  private processRegistration(repositoryDetails: RepoDetails) {
    this.isRegistered = false;
    this.repoValidationProgress = null;
    this.setAppName(repositoryDetails.name);
    // In edit mode the appType is already set. We do not reset it to the derived value.
    if (!this.isEditMode) {
      this.setAppType();
    }
  }

  private setAppName(applicationName: string): void {
    const repoUrlCtrl = this.registerForm.get('repoUrl');

    if (repoUrlCtrl.valid) {
      this.appName = applicationName;
    } else {
      // Dont set the appname if the repo url is not valid
      this.appName = null;
    }
  }

  private setAppType(): void {
    if (this.appName) {
      const appType = AppType.from(this.appName.split('-')[0]);

      if (appType !== AppType.UNKNOWN) {
        this.registerForm.get('appType').setValue(appType.toLowerCase());
      }
    }
  }

  setDefaultValueStream() {
    this.registerForm.get('valueStream').setValue(this.userService.getCurrentUser().valueStreams[0]);
  }


  register() {
    const formObj = this.registerForm.getRawValue();
    const app = new AppRegisterRequest();
    app.repoUrl = this.repositoryDetails.htmlUrl;
    app.repoProject = this.repositoryDetails.project.name;
    app.appName = this.repositoryDetails.name;
    app.type = formObj.appType.toLowerCase();
    app.serviceNowQueue = formObj.serviceQueue;
    app.valueStreamGroup = formObj.valueStream;
    app.creatorUpi = this.userService.getCurrentUser().userId;

    this.registrationProgress = new ProgressIndicator('info', `Registering application`);

    this.metadataService.registerApp(app).subscribe((res: AppRegistrationResponse) => {
      if (res.result === 'created') {
        this.registrationProgress.updateProgress('info', `Application ${res.id} registered`);
      } else {
        this.registrationProgress.updateProgress('info', `Application ${res.id} registration updated`);
      }
    }, (err: HttpErrorResponse) => {
      const athenaError: BackendErrorResponse = err.error;
      let errMsg = err.message;
      if (athenaError && athenaError.message !== '') {
        errMsg = athenaError.message;
      }

      this.registrationProgress.updateProgress('error', `Unable to register the application - ${errMsg}`);
    });
  }

  compareServiceQueue(o1: ServiceNowQueue, o2: ServiceNowQueue): boolean {
    return o1.id === o2.id && o1.name === o2.name;
  }
}
