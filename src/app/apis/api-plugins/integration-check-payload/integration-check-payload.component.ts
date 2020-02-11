import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {KafkaConnectService} from '../../../kafka/services/kafka-connect.service';
import {BackendErrorResponse} from '../../../models/Common';


@Component({
  selector: 'app-integration-check-payload',
  templateUrl: './integration-check-payload.component.html',
  styleUrls: ['./integration-check-payload.component.css']
})
export class IntegrationCheckPayloadComponent implements OnInit {

  initialLoading: boolean;
  loading: boolean;
  integrationUrlNotFound: boolean;
  apiName: string;
  targetPayload: string;
  integrationUrl: string;

  constructor(private apiService: ApiService,
              private kafkaConnectService: KafkaConnectService,
              private route: ActivatedRoute) {

    this.loading = true;
    this.integrationUrl = null;
    this.initialLoading = false;

    // Get params from URL
    this.route.paramMap.subscribe((params: ParamMap) => {
        const groupId = params.get('group');
        const apiId = params.get('apiId');

        // Fetch API details
        this.apiService.getActiveApi(groupId, apiId).subscribe(data => {
          this.apiName = data["name"];

          // Try to find the Integration URL based on API Name
          this.kafkaConnectService.getIntegrationUrlByApiName(this.apiName).subscribe(data => {
            this.integrationUrl = data.url;
            this.loading = false;
            this.initialLoading = true;
          },
          error => {
            console.warn(`No integration url found for api '${this.apiName}'`);
            this.loading = false;
            this.integrationUrlNotFound = true;
          });
        });
      });
  }

  ngOnInit() {
  }

  getPayload(payload: string) {
    if(!this.apiName || !this.integrationUrl) {
      console.warn(`No request sent because API Name and/or Integration URL have not been set`);
      return;
    }

    if(this.loading === false) {
      this.loading = true;
      this.apiService.checkIntegrationApiPayload(this.apiName, this.integrationUrl, payload).subscribe(
        data => {
          const payload = data.toString();

          if(payload && payload.trim() !== '') {
            this.targetPayload = payload;
          }
          else {
            const msg = `Check payload endpoint of ${this.apiName} returned an empty response body`;
            console.warn(msg);
            this.targetPayload = msg;
          }

          this.loading = false;
        },
        error => {

          let errMsg = `An unexpected error happened ${error.error}`;

          try {
            const errorObject: BackendErrorResponse = JSON.parse(error.error);

            if(errorObject && errorObject.message !== '') {
              errMsg = `Failed to check payload: ${errorObject.message} (HTTP ${errorObject.status} - ${errorObject.error})`;
            } else {
              errMsg = `Failed to check payload: Got a HTTP ${error.status} - ${error.statusText}`;
            }
          } catch(ignored) {
          }

          console.error(errMsg);
          this.targetPayload = errMsg;
          this.loading = false;
        }
      );
    } else {
      console.warn(`No request sent because we are still waiting for a response from the previous one`);
    }
  }
}

