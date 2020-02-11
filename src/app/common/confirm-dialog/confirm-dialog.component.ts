import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ConfirmDialog} from '../../models/ConfirmDialog';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  phrase: string;

  constructor( public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialog, private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  continue() {
    if ( this.data.reConfirmPhrase === null  ||  this.phrase === this.data.reConfirmPhrase) {
      this.dialogRef.close(true);
    } else {
      alert('Naughty! Dont play mischief.');
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  disableAction() {
    return this.data.reConfirmPhrase && this.phrase !== this.data.reConfirmPhrase;
  }

  getMessage(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.data.message);
  }
}
