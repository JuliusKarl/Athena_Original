import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApisLayoutComponent} from '../apis/apis-layout.component';
import {ApiBoxPortsComponent} from '../apis/api-box-ports/api-box-ports.component';
import {ApiPluginsComponent} from '../apis/api-plugins/api-plugins.component';
import {DashboardHomeComponent} from '../dashboard/dashboard-home/dashboard-home.component';
import {KafkaLayoutComponent} from '../kafka/kafka-layout.component';
import {KafkaTopicsLayoutComponent} from '../kafka/kafka-topics/kafka-topics-layout.component';
import {KafkaConnectLayoutComponent} from '../kafka/kafka-connect/kafka-connect-layout.component';
import {KafkaConnectorComponent} from '../kafka/kafka-connect/kafka-connector/kafka-connector.component';
import {KafkaTopicComponent} from '../kafka/kafka-topics/kafka-topic/kafka-topic.component';
import {KafkaConsumerComponent} from '../kafka/kafka-consumers/kafka-consumer/kafka-consumer.component';
import {PartitionDataComponent} from '../kafka/kafka-topics/partition-data/partition-data.component';
import {KafkaConsumersLayoutComponent} from '../kafka/kafka-consumers/kafka-consumers-layout.component';
import {KafkaHomeComponent} from '../kafka/kafka-home/kafka-home.component';
import {KafkaConnectSummaryComponent} from '../kafka/kafka-connect/kafka-connect-summary/kafka-connect-summary.component';
import {PostMessagesComponent} from '../kafka/kafka-connect/post-messages/post-messages.component';
import {FlowLayoutComponent} from '../flow/flow-layout.component';
import {ArchComponent} from '../flow/arch/arch.component';
import {CoreAppsComponent} from '../flow/core-apps/core-apps.component';
import {InitLayoutComponent} from '../init/init-layout.component';
import {StarterComponent} from '../init/starter/starter.component';
import {IntegrationCheckPayloadComponent} from '../apis/api-plugins/integration-check-payload/integration-check-payload.component';
import {GuardNonProdAdminOnly} from '../common/security/GuardNonProdAdminOnly';
import {CheckPayloadComponent} from '../kafka/kafka-connect/check-integration-payload/check-integration-payload.component';
import {RegisterComponent} from '../init/register/register.component';
import {DeployComponent} from '../init/deploy/deploy.component';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardHomeComponent},
      {path: 'init', component: InitLayoutComponent, children: [
          {path: '', redirectTo: 'develop', pathMatch: 'full'},
          {path: 'develop', component: StarterComponent},
          {path: 'register', component: RegisterComponent, canActivate: [GuardNonProdAdminOnly]},
          {path: 'register/:appName', component: RegisterComponent, canActivate: [GuardNonProdAdminOnly]},
          {path: 'deploy', component: DeployComponent, canActivate: [GuardNonProdAdminOnly]},
        ]},
      {
        path: 'flow', component: FlowLayoutComponent, children: [
          {path: '', redirectTo: 'coreApps', pathMatch: 'full' },
          {path: 'coreApps', component: CoreAppsComponent },
          {path: ':appName', component: ArchComponent }
        ]
      },
      {
        path: 'apis', component: ApisLayoutComponent, children: [
          {path: '', component: ApiBoxPortsComponent},
          {path: ':group/:apiId', component: ApiPluginsComponent},
          {path: ':group/:apiId/check-payload', component: IntegrationCheckPayloadComponent}
        ],
      },
      {
        path: 'kafka', component: KafkaLayoutComponent, children: [
          {path: '', redirectTo: 'topics', pathMatch: 'full'},
          {path: 'topics', component: KafkaTopicsLayoutComponent, children: [
              {path: '', component: KafkaHomeComponent},
              {path: ':topicName', component: KafkaTopicComponent, children: [
                  {path: 'data/:partition', component: PartitionDataComponent}
                ]},
              {path: ':topicName/:consumerGroup', component: KafkaConsumerComponent}
            ]
          },
          {path: 'consumers', component: KafkaConsumersLayoutComponent, children: [
              {path: '', component: KafkaHomeComponent},
              {path: ':consumerGroup', component: KafkaConsumerComponent},
            ]
          },
          {
            path: 'connect', component: KafkaConnectLayoutComponent, children: [
              {path: '', component: KafkaConnectSummaryComponent},
              {path: ':connectorName', component: KafkaConnectorComponent},
              {path: ':connectorName/publish-messages/:targetApp', component: PostMessagesComponent},
              {path: ':connectorName/check-payload/:targetApp', component: CheckPayloadComponent}
            ]
          }
        ]
      }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        /** useHash=true is required because of the way we deploy the app on Apache web server */
        useHash: true
      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: []
})

export class AppRoutingModule { }
