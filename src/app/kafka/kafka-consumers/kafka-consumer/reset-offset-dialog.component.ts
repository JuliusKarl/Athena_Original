import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ResetOffsetDialogData} from './kafka-consumer.component';
import {ResetOffset, ResetOffsetOperation, ResetOffsetResponse} from '../../../models/Kafka';
import {KafkaService} from '../../services/kafka.service';
import {FormControl, Validators} from '@angular/forms';
import {ConfirmDialog} from '../../../models/ConfirmDialog';
import {ConfirmDialogService} from '../../../common/services/confirm-dialog.service';

@Component({
  selector: 'app-reset-offset-dialog',
  templateUrl: './reset-offset-dialog.component.html',
  styleUrls: ['./reset-offset-dialog.component.css']
})
export class ResetOffsetDialogComponent {
  offsetFormControl: FormControl;
  error: string;
  operations: ResetOffsetOperation[];

  loading: boolean;
  success: boolean;

  constructor(public dialogRef: MatDialogRef<ResetOffsetDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ResetOffsetDialogData,
              private kafkaService: KafkaService, private confirmDialogService: ConfirmDialogService) {
    this.offsetFormControl = new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$')
    ]);
  }

  hasFormErrors(): boolean {
    if (this.offsetFormControl.errors) {
      return true;
    }
    return false;
  }

  close(): void {
    this.dialogRef.close();
  }

  resetConfirmDialog() {

    if (this.hasFormErrors()) {
      return;
    }

    let  dialogConfig: ConfirmDialog;
    dialogConfig = {
      title: 'Reset Offset',
      message: `Are you sure you want to reset offset for <b>${this.data.consumerGroup}</b> to <b>${this.offsetFormControl.value}</b>?` +
        `<br><br><b>This would resend all messages received after ${this.offsetFormControl.value - 1} to the subscriber/s.</b>`,
      reConfirmPhrase: 'reset me',
      yesButton: 'Reset' , noButton: 'Cancel'
    };

    this.confirmDialogService.showDialog(dialogConfig).subscribe(result => {
      if ( result) {
        this.reset();
      }
    });
  }

  reset(): void {

    const offset: ResetOffset = new ResetOffset();
    offset.topic = this.data.topic;
    offset.partition = this.data.partition;
    offset.offset = this.offsetFormControl.value;

    this.loading = true;
    this.success = false;

    this.kafkaService.resetOffset(this.data.consumerGroup, offset).subscribe(result => {
      this.loading = false;
      this.success = true;

      if (result && result.operations) {
        this.operations = result.operations;
      }
    }, err => {
      this.loading = false;

      if (err.status === 403) {
        this.error = err.error.message;
      } else {
        this.error = 'Unable to reset offset. Please make sure there is no consumer connected to this consumer group.';
      }

      const response: ResetOffsetResponse = err.error;
      if (response && response.operations) {
        this.operations = response.operations;
      }

    });
  }
}
