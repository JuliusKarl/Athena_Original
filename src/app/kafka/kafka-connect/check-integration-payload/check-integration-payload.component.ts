import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {KafkaConnectService} from '../../services/kafka-connect.service';
import {KafkaService} from '../../services/kafka.service';
import {KafkaConnector} from '../../../models/Kafka';
import {FormControl, Validators} from '@angular/forms';
import BeautifyHelper from './beautifyHelper';
import {HttpErrorResponse, HttpResponse, HttpResponseBase} from '@angular/common/http';

@Component({
  selector: 'app-check-payload',
  templateUrl: './check-integration-payload.component.html',
  styleUrls: ['./check-integration-payload.component.css', '../kafka-connect-layout.component.css']
})
export class CheckPayloadComponent implements OnInit {

  targetApplication: string;
  connector: KafkaConnector;
  integrationUrl: string;
  topics;
  topicName: string;
  sampleMessages: string[];
  messageFormControl: FormControl;
  err: string;
  integrationResponse: HttpResponseBase;
  targetPayload: string;
  fullscreen: boolean;
  sending: boolean;

  constructor(private kafkaConnectService: KafkaConnectService,
              private route: ActivatedRoute,
              private router: Router,
              private kafkaService: KafkaService) {
    this.messageFormControl = new FormControl('', [
      Validators.required
    ]);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const connectorName = params.get('connectorName');
        this.targetApplication = params.get('targetApp');

        this.kafkaConnectService.getConnector(connectorName).subscribe(
          connector => {
            this.connector = connector;

            this.integrationUrl = connector.config['callback.request.url'];
            this.topics = connector.config['topics'].split(',');

            this.topicName = this.topics[0];
            this.setSampleMessages();
          },
          error => {
            console.error('Unable to get kafka connector ' + connectorName, error);
          });
      });
  }

  setSampleMessages() {
    this.err = null;
    this.kafkaService.getTopicSampleMessages(this.topicName, 0, 1).subscribe(
      data => {
        if (typeof data === 'string') {
          this.err = data;
        } else {
          this.sampleMessages = data;
        }
      }
    );
  }

  checkPayload(message) {
    this.integrationResponse = null;
    this.targetPayload = null;

    const checkPayloadRequest: any = {
      'url': this.integrationUrl,
      'sourcePayload': message
    };
    const api = this.connector.name.replace('connection', 'integration');
    this.sending = true;
    this.kafkaConnectService.checkIntegrationApiPayload(api, checkPayloadRequest, this.topicName)
      .subscribe((response: HttpResponse<string>) => {
        this.sending = false;
        this.integrationResponse = response;
        this.targetPayload = BeautifyHelper.beautify(response.body);
      }, (error: HttpErrorResponse) => {
        this.sending = false;
        this.integrationResponse = error;

        let err = BeautifyHelper.parseJson(error.error);

        // If using the standard error response, more details will be in the "message" field
        if(err.message) {
          this.targetPayload = BeautifyHelper.beautify(err.message);
        } else {
          this.targetPayload = BeautifyHelper.beautify(error.error);
        }
      });
  }

  toggleScreen() {
    this.fullscreen = !this.fullscreen;
    const container = <HTMLElement>document.querySelector('#content');

    setTimeout(() => {
      container.scrollBy(0, window.innerHeight);
    }, 10);
  }
}
