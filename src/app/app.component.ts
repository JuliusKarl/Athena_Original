import {Component, Injectable} from '@angular/core';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {EnvService} from './common/services/env.service';
import {environment, properties} from '../environments/environment';
import {SecurityService} from './common/services/security.service';
import {NavigationEnd, Router} from '@angular/router';
import {UserService} from './common/services/user.service';
import {User} from './models/User';
import {UserDetailsDialogComponent} from './common/user-details-dialog/user-details-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  env: string;
  envLabel: string;
  user: User;

  constructor(private matIconRegistry: MatIconRegistry,
              private router: Router,
              private domSanitizer: DomSanitizer,
              private envService: EnvService,
              private securityService: SecurityService,
              private dialog: MatDialog,
              private userService: UserService) {
    this.updateIconRegistry();
    this.env = properties.env;
    this.envLabel = this.envService.getEnvTitle() + ' environment';
    this.redirectToLastUrl();
    this.user = this.userService.getCurrentUser();

    /**
     * Cache the last visited url
     * This would be used to redirect user to if user returns
     */
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.localStorage.setItem('athena.lastUrl', event.urlAfterRedirects);
      }
    });
  }
  updateIconRegistry(): void {
    this.matIconRegistry.addSvgIcon(
      `athena-icon`,
      this.domSanitizer
        .bypassSecurityTrustResourceUrl('../assets/icons/icon-athena.svg')
    );
    this.matIconRegistry.addSvgIcon(
    `springboot-icon`,
    this.domSanitizer
    .bypassSecurityTrustResourceUrl('../assets/icons/icon-spring-boot.svg')
    );
    this.matIconRegistry.addSvgIcon(
    `kafka-icon`,
    this.domSanitizer

    .bypassSecurityTrustResourceUrl('../assets/icons/icon-kafka.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `kibana-icon`,
      this.domSanitizer
        .bypassSecurityTrustResourceUrl('../assets/icons/icon-kibana.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `admin-icon`,
      this.domSanitizer
        .bypassSecurityTrustResourceUrl('../assets/icons/icon-admin.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `git-icon`,
      this.domSanitizer
        .bypassSecurityTrustResourceUrl('../assets/icons/icon-git.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `jenkins-icon`,
      this.domSanitizer
        .bypassSecurityTrustResourceUrl('../assets/icons/icon-jenkins.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `check-payload-icon`,
      this.domSanitizer
        .bypassSecurityTrustResourceUrl('../assets/icons/icon-check-payload.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `publish-message-icon`,
      this.domSanitizer
        .bypassSecurityTrustResourceUrl('../assets/icons/icon-publish-message.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `develop-icon`,
      this.domSanitizer
        .bypassSecurityTrustResourceUrl('../assets/icons/icon-develop.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `register-icon`,
      this.domSanitizer
        .bypassSecurityTrustResourceUrl('../assets/icons/icon-register.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `deploy-icon`,
      this.domSanitizer
        .bypassSecurityTrustResourceUrl('../assets/icons/icon-deploy.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `monitor-icon`,
      this.domSanitizer
        .bypassSecurityTrustResourceUrl('../assets/icons/icon-monitor.svg')
    );
  }

  /**
   * Redirect to the last url used if no path provided
   */
  redirectToLastUrl() {
    const lastUrl = window.localStorage.getItem('athena.lastUrl');
    if (lastUrl && window.location.hash.trim().length === 0) {
      this.router.navigateByUrl(lastUrl);
    }
  }

  openUserDetailsDialog() {

    const dialogRef = this.dialog.open(UserDetailsDialogComponent, {
      width: '300px',
      position: {
        top: '50px',
        right: '15px'
      },
      backdropClass: 'transparent-overlay',
      data: this.user
    });

  }


}
