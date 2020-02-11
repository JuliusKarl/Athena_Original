import {Component, OnInit} from '@angular/core';
import {MainApp, RawApp} from '../../models/App';
import {MetadataService} from '../../common/services/metadata.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {User} from '../../models/User';
import {UserService} from '../../common/services/user.service';
import {Draw} from './draw';

@Component({
  selector: 'app-bom-arch',
  templateUrl: './arch.component.html',
  styleUrls: ['./arch.component.css', '../flow-layout.component.css']
})
export class ArchComponent implements OnInit {
  user: User;
  msg: any;
  appName: string;
  rawApp: RawApp;
  mainApp: MainApp;
  draw: Draw;
  totalDependencies = 0;
  totalConsumers = 0;

  trackByFn =  (index: number, item: any) => index;

  constructor(private router: Router, private route: ActivatedRoute,
              private bomService: MetadataService, private userService: UserService) {
    this.user = this.userService.getCurrentUser();
  }

  displayData() {
      let x = window.open();
      x.document.open();
      x.document.write('<html><body><pre>' + JSON.stringify(this.rawApp, null, 1) + '</pre></body></html>');
      x.document.close();
  }
  

  ngOnInit() {
    this.draw = new Draw();

    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.appName = params.get('appName');
        console.log('Getting Bom for ', this.appName);
        this.bomService.getAppBom(this.appName).subscribe(
          app => {
              this.rawApp = app;
              this.mainApp = this.draw.getMainApp(app);
              this.calculateTotals();
              this.msg = null;
            },
          err => {
            console.log(err);
            this.msg = { msg: 'No details for application ' +  this.appName + ' found.',
            type: 'warning'}; }
        );
      }
    );
  }

  // navigate to the details for the clicked app
  explore(appName: any) {
    console.log('appName ', appName);
    this.router.navigate(['flow', appName]).catch(err => console.log(err));
  }

  calculateTotals(): void {
    this.totalConsumers = (this.rawApp.consumers ? this.rawApp.consumers.length :  0) +
      (this.rawApp.producerTopics ? this.rawApp.producerTopics.length : 0);
    this.totalDependencies = this.mainApp.dependencies.length - this.totalConsumers;
  }

  back() {
    window.history.back();
  }


  view(link: string, event) {
    if (link) {
      this.router.navigate([link]);
    }
  }
}
