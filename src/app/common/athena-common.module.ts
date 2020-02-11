import {NgModule} from '@angular/core';
import {FilterPipe} from './pipes/filter.pipe';
import {SortByPipe} from './pipes/sortBy.pipe';
import {EnableActionDirective} from './directives/enable-action.directive';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {MaterialModule} from '../material.module';
import {CommonModule} from '@angular/common';
import {UserDetailsDialogComponent} from './user-details-dialog/user-details-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    FilterPipe,
    SortByPipe,
    EnableActionDirective,
    ConfirmDialogComponent,
    UserDetailsDialogComponent
  ],
  exports: [
    FilterPipe,
    SortByPipe,
    EnableActionDirective
  ],
  entryComponents: [
    ConfirmDialogComponent,
    UserDetailsDialogComponent
  ]
})
export class AthenaCommonModule {
}
