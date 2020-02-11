import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {UserService} from '../../common/services/user.service';
import {User} from '../../models/User';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {

  commitId: string;
  buildTime: string;
  user: User;

  constructor(private userService: UserService) {
    this.commitId = environment.commitId;
    this.buildTime = environment.buildTime;
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
  }

}
