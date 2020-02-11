import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BackendErrorResponse} from '../../../../models/Common';

@Component({
  selector: 'app-submit-dialog',
  templateUrl: './submit-dialog.component.html',
  styleUrls: ['./submit-dialog.component.css']
})
export class SubmitDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SubmitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubmitDialogInput) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }
}

export interface SubmitDialogInput {
  success: boolean;
  error?: BackendErrorResponse;
  logsUrl: string;
}
