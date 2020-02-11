import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {User} from '../../models/User';

@Component({
  selector: 'app-user-details-dialog',
  templateUrl: './user-details-dialog.component.html',
  styleUrls: ['./user-details-dialog.component.css']
})
export class UserDetailsDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public user: User) { }


  ngOnInit() {
  }
}
