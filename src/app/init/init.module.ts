import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InitLayoutComponent} from './init-layout.component';
import {AthenaCommonModule} from '../common/athena-common.module';
import {MaterialModule} from '../material.module';
import {StarterComponent} from './starter/starter.component';
import {RouterModule} from '@angular/router';
import {RegisteredApplicationsComponent} from './registered-applications/registered-applications.component';
import {RegisterComponent} from './register/register.component';
import {DeployComponent} from './deploy/deploy.component';
import {FlexModule} from '@angular/flex-layout';
import {PipelineCardComponent} from './deploy/pipeline-card/pipeline-card.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AthenaCommonModule,
    MaterialModule,
    FlexModule
  ],
  exports: [
    RegisteredApplicationsComponent
  ],
  declarations: [
    InitLayoutComponent,
    RegisteredApplicationsComponent,
    StarterComponent,
    RegisterComponent,
    DeployComponent,
    PipelineCardComponent]
})
export class InitModule { }
