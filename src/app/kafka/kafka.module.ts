import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KafkaLayoutComponent} from './kafka-layout.component';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../material.module';
import {KafkaTopicsListComponent} from './kafka-topics/kafka-topics-list/kafka-topics-list.component';
import {KafkaTopicsLayoutComponent} from './kafka-topics/kafka-topics-layout.component';
import {KafkaConnectorsComponent} from './kafka-connect/kafka-connectors/kafka-connectors.component';
import {KafkaConnectLayoutComponent} from './kafka-connect/kafka-connect-layout.component';
import {AthenaCommonModule} from '../common/athena-common.module';
import {KafkaConnectorComponent} from './kafka-connect/kafka-connector/kafka-connector.component';
import {KafkaConnectSummaryComponent} from './kafka-connect/kafka-connect-summary/kafka-connect-summary.component';
import {KafkaConnectState} from './services/kafka-connect-state.service';
import {KafkaConsumerComponent} from './kafka-consumers/kafka-consumer/kafka-consumer.component';
import {KafkaTopicComponent} from './kafka-topics/kafka-topic/kafka-topic.component';
import {PartitionDataComponent} from './kafka-topics/partition-data/partition-data.component';
import {KafkaConsumersListComponent} from './kafka-consumers/kafka-consumers-list/kafka-consumers-list.component';
import {KafkaConsumersLayoutComponent} from './kafka-consumers/kafka-consumers-layout.component';
import {KafkaHomeComponent} from './kafka-home/kafka-home.component';
import {MatDialogModule} from '@angular/material';
import {PostMessagesComponent} from './kafka-connect/post-messages/post-messages.component';
import {SubmitDialogComponent} from './kafka-connect/post-messages/submit-dialog/submit-dialog.component';
import {ResetOffsetDialogComponent} from './kafka-consumers/kafka-consumer/reset-offset-dialog.component';
import {CheckPayloadComponent} from './kafka-connect/check-integration-payload/check-integration-payload.component';
import {ConfirmDialogComponent} from '../common/confirm-dialog/confirm-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    AthenaCommonModule,
    MatDialogModule
  ],
  declarations: [
    KafkaLayoutComponent,
    KafkaTopicsLayoutComponent,
    KafkaTopicsListComponent,
    KafkaTopicComponent,
    KafkaConsumerComponent,
    KafkaConnectorsComponent,
    KafkaConnectLayoutComponent,
    KafkaConnectorComponent,
    KafkaConnectSummaryComponent,
    PartitionDataComponent,
    KafkaConsumersListComponent,
    KafkaConsumersLayoutComponent,
    KafkaHomeComponent,
    PostMessagesComponent,
    SubmitDialogComponent,
    ResetOffsetDialogComponent,
    CheckPayloadComponent
  ],
  entryComponents: [
    SubmitDialogComponent,
    ResetOffsetDialogComponent,
    ConfirmDialogComponent
  ],
  providers: [
    KafkaConnectState
  ]
})
export class KafkaModule {
}
