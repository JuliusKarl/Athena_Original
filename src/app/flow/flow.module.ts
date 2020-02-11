import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlowLayoutComponent} from './flow-layout.component';
import {ArchComponent} from './arch/arch.component';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../material.module';
import {CoreAppsComponent} from './core-apps/core-apps.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule
  ],
  declarations: [FlowLayoutComponent, ArchComponent, CoreAppsComponent]
})
export class FlowModule { }
