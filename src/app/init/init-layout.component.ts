import {Component, OnInit} from '@angular/core';
import {SecurityService} from '../common/services/security.service';

@Component({
  selector: 'app-polymer-layout',
  templateUrl: './init-layout.component.html',
  styleUrls: ['./init-layout.component.css']
})
export class InitLayoutComponent implements OnInit {

  constructor(private securityService: SecurityService) {}

  ngOnInit() {}


  nonProdAdminOnly() {
    return this.securityService.nonProdAdminOnly();
  }
}
