import {Component, OnInit} from '@angular/core';
import {MetadataService} from '../../common/services/metadata.service';
import {AppType, RawApp} from '../../models/App';
import {UserService} from '../../common/services/user.service';
import {HttpErrorResponse} from '@angular/common/http';
import {SecurityService} from '../../common/services/security.service';
import {JenkinsService} from '../services/jenkins.service';
import {JobDetails} from '../../models/Jenkins';
import {properties} from '../../../environments/environment';
import {KibanaService} from '../../common/services/kibana.service';

@Component({
  selector: 'app-registered-applications',
  templateUrl: './registered-applications.component.html',
  styleUrls: ['./registered-applications.component.css']
})
export class RegisteredApplicationsComponent implements OnInit {

  NO_VALUE_STREAM = 'UNASSIGNED';
  searchText: string;
  searchAppText: string;
  applications: Map<string, RawApp[]> = new Map();
  loading: boolean;
  error: boolean;
  totalRegisteredApps = 0;

  constructor(private metadataService: MetadataService,
              private securityService: SecurityService,
              private userService: UserService,
              private jenkinsService: JenkinsService,
              private kibanaService: KibanaService) { }

  ngOnInit() {
    this.loading = true;
    this.error = false;

    this.initApplications();
    this.loadApplications();
  }

  /** Initialize empty list for each user value stream */
  initApplications(): void {
    for (const valueStream of this.userService.getCurrentUser().valueStreams) {
      this.applications.set(valueStream, []);
    }
  }

  /** Call the backend to get the list of applications that the current user can see */
  loadApplications(): void {
    const VALID_TYPES = [AppType.API, AppType.INTEGRATION];

    this.metadataService.getApps().subscribe(apps => {
        this.totalRegisteredApps = apps.length;
        for (const app of apps) {

          // Filter out the types we don't want to display
          if (!VALID_TYPES.includes(AppType.from(app.type))) {
            continue;
          }

          // Get the value stream this application belongs to
          const valueStream = app.valueStreamGroup || this.NO_VALUE_STREAM;
          // Group the applications by value stream
          const appsByValueStream = this.applications.get(valueStream) || [];
          appsByValueStream.push(app);
          this.applications.set(valueStream, appsByValueStream);

          app['loading'] = true;
          this.updateLogDetails(app);
          this.updatePipelineDetails(app);
        }
        this.loading = false;
        this.error = false;
      },
      (error: HttpErrorResponse) => {
        console.warn(`An error happened while trying to retrieve current user applications`);
        this.loading = false;
        this.error = true;
      });
  }

  updateLogDetails(app: RawApp): void {
    app['logs'] = this.kibanaService.constructKibanaLink('apiLogFilter',
      {apiName: app.appName, environ: properties.env});
  }

  updatePipelineDetails(app: RawApp): void {
    this.jenkinsService.checkPipelineExist(app.repoProject, app.appName).subscribe((jobDetails: JobDetails) => {
      app['pipeline'] = jobDetails.url;
      app['health'] = {};
      app['health']['build'] = jobDetails.healthReport[0] ? 'Build stability: '
        + jobDetails.healthReport[0].score + '%' : 'Build stability: New';
      app['loading'] = false;
    }, err => {
      app['loading'] = false;
    });
  }

  nonProdAdminOnly() {
    return this.securityService.nonProdAdminOnly();
  }
}
