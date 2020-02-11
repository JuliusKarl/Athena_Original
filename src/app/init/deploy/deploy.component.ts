import {Component, OnInit} from '@angular/core';
import {MetadataService} from '../../common/services/metadata.service';
import {RawApp} from '../../models/App';
import {JenkinsService} from '../services/jenkins.service';
import {ProgressIndicator} from '../../models/ProgressIndicator';
import {JobDetails} from '../../models/Jenkins';
import {UserService} from '../../common/services/user.service';

@Component({
  selector: 'app-deploy',
  templateUrl: './deploy.component.html',
  styleUrls: ['./deploy.component.css']
})
export class DeployComponent implements OnInit {

  noPipelineApps: RawApp[];
  pipelineApps: RawApp[];
  applications: RawApp[];
  loadingProgress: ProgressIndicator;
  valueStream: string[];

  constructor(private userService: UserService, private deployService: JenkinsService,
  private metadataService: MetadataService) {
    this.valueStream = userService.getCurrentUser().valueStreams;
    this.loadProjects();
  }


  ngOnInit() {
  }

  loadProjects() {
    this.loadingProgress =  new ProgressIndicator('info', 'Loading applications');
    this.noPipelineApps = [];
    this.pipelineApps = [];
    this.metadataService.getApps().subscribe( (apps: RawApp[]) => {
      this.applications = apps
        .filter(app => {
          if (app.repoProject) {
            return true;
          } else {
            console.warn(`Application '${app.appName}' not displayed because it does not have the property 'repoProject'`);
            return false;
          }
        }).sort((a, b) => a.appName.localeCompare(b.appName));

      this.checkPipelineExist();
    }, err => {
      console.log(err);
      this.loadingProgress =  new ProgressIndicator('error', 'Unable to load applications');
    });
  }

  checkPipelineExist() {
    this.applications.forEach( (app, index) => {
      console.log(`Checking for existing pipeline`);
      this.deployService.checkPipelineExist(app.repoProject, app.appName).subscribe( (jobDetails: JobDetails) => {
        app['pipeline'] = jobDetails.url;
        this.pipelineApps.push(app);
        console.log(this.pipelineApps);
        if (index >=  this.applications.length - 1) {
          this.loadingProgress = null;
        }
      }, err => {
        if (err['status'] === 404) {
           // Pipeline not found, allow initialization
        } else {
          app['deployProgress'] = new ProgressIndicator('error', 'Error from Jenkins');
        }
        this.noPipelineApps.push(app);
        if (index >=  this.applications.length - 1) {
          this.loadingProgress = null;
        }
      });
    });
  }

  refresh() {
    this.loadProjects();
  }

}
