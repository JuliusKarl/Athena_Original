import {Injectable} from '@angular/core';
import {ConfirmDialog} from '../../models/ConfirmDialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private dialog: MatDialog ) { }

  showDialog(dialogConfig: ConfirmDialog): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: dialogConfig });

    return dialogRef.afterClosed();
  }

}
