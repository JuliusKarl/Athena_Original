import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApisLayoutComponent} from './apis-layout.component';
import {MaterialModule} from '../material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ApisListComponent} from './apis-list/apis-list.component';
import {ApiPluginsComponent} from './api-plugins/api-plugins.component';
import {ApiConsumersComponent} from './api-consumers/api-consumers.component';
import {RouterModule} from '@angular/router';
import {ApiBoxPortsComponent} from './api-box-ports/api-box-ports.component';
import {AthenaCommonModule} from '../common/athena-common.module';
import {IntegrationCheckPayloadComponent} from './api-plugins/integration-check-payload/integration-check-payload.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    AthenaCommonModule
  ],
  declarations: [
    ApisLayoutComponent,
    ApisListComponent,
    ApiPluginsComponent,
    ApiConsumersComponent,
    ApiBoxPortsComponent,
    IntegrationCheckPayloadComponent,
  ]
})
export class ApisModule {
}
