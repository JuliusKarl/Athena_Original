import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {KafkaConnectService} from '../../services/kafka-connect.service';
import {KafkaConnector} from '../../../models/Kafka';
import {MatDialog} from '@angular/material';
import {SubmitDialogComponent, SubmitDialogInput} from './submit-dialog/submit-dialog.component';
import {HttpErrorResponse} from '@angular/common/http';
import {KafkaService} from '../../services/kafka.service';
import {KibanaService} from '../../../common/services/kibana.service';
import {AbstractControl, FormControl, ValidatorFn, Validators} from '@angular/forms';
import {environment, properties} from '../../../../environments/environment';
import {ConfirmDialog} from '../../../models/ConfirmDialog';
import {ConfirmDialogService} from '../../../common/services/confirm-dialog.service';

@Component({
  selector: 'app-post-messages',
  templateUrl: './post-messages.component.html',
  styleUrls: ['./post-messages.component.css', '../kafka-connect-layout.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PostMessagesComponent implements OnInit {
  targetApplication: string;
  connector: KafkaConnector;
  integrationUrl: string;
  topics;
  topicName: string;
  sampleMessages: string[];
  messagesFormControl: FormControl;
  maxPublishMsgCount = 100;
  err: string;

  constructor(private kafkaConnectService: KafkaConnectService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private confirmDialogService: ConfirmDialogService,
              private kafkaService: KafkaService,
              private kibanaService: KibanaService) {
    this.messagesFormControl = new FormControl('', [
      Validators.required, this.messagesCountValidator()
    ]);
    this.maxPublishMsgCount = properties.maxPublishMsgCount;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.targetApplication = params.get('targetApp');
        const connectorName = params.get('connectorName');


        this.kafkaConnectService.getConnector(connectorName).subscribe(
          connector => {
            this.connector = connector;

            const method = connector.config['callback.request.method'];
            const url = connector.config['callback.request.url'];
            this.topics = connector.config['topics'].split(',');

            this.topicName = this.topics[0];
            this.setSampleMessages();

            if (method && url) {
              this.integrationUrl = `${method} ${url}`;
            }
          },
          error => {
            console.error('Unable to get kafka connector ' + connectorName, error);
          });
      }
    );
  }

  messagesCountValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const count = control.value.split('\n').length;
      if (count > this.maxPublishMsgCount) {
        return {'messagesCountExceeded': {messagesCount: count}};
      }
      return null;
    };
  }

  publishConfirmDialog(messages: string) {
    let  dialogConfig: ConfirmDialog;
    dialogConfig = {
      title: 'Publish Messages',
      message: `Are you sure you want to publish messages to <b>${this.targetApplication}</b> integration?` +
        '<br><br><b>This would send data to the integrations target application.</b>',
      reConfirmPhrase: 'publish me',
      yesButton: 'Publish' , noButton: 'Cancel'
    };

    if (environment.production) {
      this.confirmDialogService.showDialog(dialogConfig).subscribe(result => {
        if ( result) {
          this.postMessages(messages);
        }
      });
    } else {
      this.postMessages(messages);
    }


  }

  postMessages(messages: string): void {

    const [response, traceId] = this.kafkaConnectService.postMessages(this.connector.name, messages, this.topicName);

    console.log(`backend: posting messages to Integration API: ${this.integrationUrl} with trace ID ${traceId}`);

    response.subscribe(
      data => this.openDialog(true, null, traceId),
      error => this.openDialog(false, error, traceId)
    );
  }

  openDialog(success: boolean, error: HttpErrorResponse, traceId: string): void {

    let dialogInput: SubmitDialogInput;
    const kibanaUrl = this.kibanaService.constructKibanaLink('postMessageFilter',
      {traceId: traceId, environ: properties.env});
    if (success === true) {
      dialogInput = {success: success, logsUrl: kibanaUrl};
    } else {
      // error.error contains the error object returned by the backend
      dialogInput = {success: success, error: error.error, logsUrl: kibanaUrl};
    }


    const dialogRef = this.dialog.open(SubmitDialogComponent, {
      width: '500px',
      data: dialogInput
    });

    dialogRef.afterClosed().subscribe(result => {
      if (success === true) {
        this.redirectToConnectorDetailsPage();
      }
    });
  }

  redirectToConnectorDetailsPage() {
    this.router.navigate(['../..'], {relativeTo: this.route});
  }

  setSampleMessages() {
    this.err = null;
    this.kafkaService.getTopicSampleMessages(this.topicName, 0, 3).subscribe(
      data => {
        if (typeof data === 'string') {
          this.err = data;
        } else {
          this.sampleMessages = data;
        }
      });
  }
}
