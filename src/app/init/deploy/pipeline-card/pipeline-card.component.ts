import {Component, Input, OnInit} from '@angular/core';
import {RawApp} from '../../../models/App';
import {SecurityService} from '../../../common/services/security.service';
import {ProgressIndicator} from '../../../models/ProgressIndicator';
import {BuildDetails, QueueDetails} from '../../../models/Jenkins';
import {JenkinsService} from '../../services/jenkins.service';

@Component({
  selector: 'app-pipeline-card',
  templateUrl: './pipeline-card.component.html',
  styleUrls: ['./pipeline-card.component.css']
})
export class PipelineCardComponent implements OnInit {

  constructor(private securityService: SecurityService, private deployService: JenkinsService) { }

  @Input() pipelines: RawApp[];
  @Input() pipelineExists: boolean;
  @Input() valueStream: string;
  @Input() loadingProgress: string;
  PROGRESS_CHECK_INTERVAL_MS = 3000;

  ngOnInit() {

  }

  initializePipeline(app: RawApp) {
    console.log('Initialize pipeline for ', app);
    app['deployProgress'] = new ProgressIndicator('info', 'Waiting for Jenkins to start the Pipeline Creation Job');

    this.deployService.triggerTemplateJob(app.appName)
      .subscribe( (buildDetails: BuildDetails) => {
        app['deployProgress'] = new ProgressIndicator('info', 'Waiting for Jenkins to start the Pipeline Creation Job');
        this.getBuildUrl(buildDetails.queueId, app);
      }, err => {
        console.error('Failed to trigger pipeline creation: ' + err);
        app['deployProgress'] = new ProgressIndicator('error', 'Error from Jenkins');
      });
  }

  private getBuildUrl(queueId: number, app: RawApp) {
    this.deployService.getJenkinsQueue(queueId)
      .subscribe( (queueDetails: QueueDetails) => {
        if (queueDetails.executable) {
          app['deployProgress'] = new ProgressIndicator('done', queueDetails.executable.url);
        } else {
          setTimeout(() => this.getBuildUrl(queueId, app), this.PROGRESS_CHECK_INTERVAL_MS);
        }
      }, err => {
        console.error('Failed to get info from Jenkins Queue: ' + err);
        app['deployProgress'] = new ProgressIndicator('error', 'Error from Jenkins');
      });
  }

  nonProdAdminOnly() {
    return this.securityService.nonProdAdminOnly();
  }
}
