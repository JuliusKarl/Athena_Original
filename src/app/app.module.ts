import {BrowserModule, Title} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {MaterialModule} from './material.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApisModule} from './apis/apis.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DashboardModule} from './dashboard/dashboard.module';
import {KafkaModule} from './kafka/kafka.module';
import {UserService} from './common/services/user.service';
import {FlowModule} from './flow/flow.module';
import {InitModule} from './init/init.module';
import {GuardNonProdAdminOnly} from './common/security/GuardNonProdAdminOnly';
import {AthenaRequestInteceptorService} from './common/interceptors/athena-request.inteceptor.service';
import {EnvService} from './common/services/env.service';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {KibanaService} from './common/services/kibana.service';
import {MatButtonModule, MatSnackBarModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    MaterialModule,
    AppRoutingModule,
    DashboardModule,
    ApisModule,
    KafkaModule,
    FlowModule,
    InitModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  providers: [
    GuardNonProdAdminOnly,
    UserService,
    KibanaService,
    {
      provide: APP_INITIALIZER,
      useFactory: (accessService: UserService, envService: EnvService, titleService: Title) => function() {

        console.log('Initializing application - Start');

        const setCurrentUserPromise = accessService.setCurrentUser().toPromise();
        titleService.setTitle(`Athena - ${envService.getEnvTitle()}`);

        // Returning a Promise will ensure it will resolve it before loading components
        return setCurrentUserPromise
                  .then(data => console.log('Initializing application - End'))
          .catch(err => console.log('ERROR: Initializing application - ' , err));
      },
      deps: [UserService, EnvService, Title],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AthenaRequestInteceptorService,
      deps: [
        EnvService,
      ],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
