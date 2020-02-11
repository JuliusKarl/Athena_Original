import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {SpringbootStarterService} from '../services/springboot-starter.service';
import {EnterpriseApp, Starter, Value} from '../../models/Starter';
import {MetadataService} from '../../common/services/metadata.service';
import {FormService} from '../../common/services/form.service';
import {AppType} from '../../models/App';


@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.css', '../init-layout.component.css']
})
export class StarterComponent implements OnInit {

  @ViewChild('dependencyInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;

  developProgress = null;

  springStarter: Starter;
  frameworkVersion: string;
  javaVersion: string;

  starterForm: FormGroup;
  dependencyCtrl = new FormControl();
  enterpriseApps: EnterpriseApp[] = [];
  dependencies: Value[];
  selectedDependencies = [];

  AppType_API = AppType.API;
  AppType_INTEGRATION = AppType.INTEGRATION;
  appTypes = [AppType.API, AppType.INTEGRATION];

  // FIXME: replace those variables by using a Map<AppType, string[]>
  apiDefaultDependenciesIds = ['web', 'actuator', 'cloud-starter-sleuth'];
  integrationDefaultDependenciesIds = ['web', 'actuator',  'cloud-starter-sleuth', 'kafka-consumer-autoregister'];

  constructor(private starterService: SpringbootStarterService, private metadataService: MetadataService,
              public formService: FormService) {

    this.starterForm = new FormGroup({
      appType: new FormControl(''),
      project: new FormControl(''),
      other: new FormControl(''),
      version: new FormControl(''),
      appName: new FormControl(''),
    });
  }

  ngOnInit() {
    this.metadataService.getEnterpriseApps().subscribe(data => {
      this.enterpriseApps = data.sort((a, b) => a.name.localeCompare(b.name));
    }, err => {
      console.log(err);

      const unknownEnterpriseApp = new EnterpriseApp();
      unknownEnterpriseApp.name = "Unknown";
      this.enterpriseApps.push(unknownEnterpriseApp);

      this.developProgress = {msg: 'Unable to get ultimate sources', type: 'warning'};
    });

    this.starterService.getSpringStarter().subscribe( data => {
        this.springStarter = data;
        this.frameworkVersion = this.springStarter.bootVersion.values[0].name;
        this.javaVersion = this.springStarter.javaVersion.values[0].name;
        const groups = this.springStarter.dependencies.values
          .map(group => group.values);
        this.dependencies = [].concat.apply([], groups);
      }, err => {
        console.log(err);
        this.developProgress = {msg: 'Unable to get Spring starter details', type: 'error'};
      }
    );
  }

  setDefaultDependencies(event) {
    const type = event.source.value.toLowerCase();
    this.selectedDependencies = this.dependencies.filter(dep => this[type + 'DefaultDependenciesIds'].indexOf(dep.id) > -1);
  }

  dependencyRemoved(dependency: string) {
    const index = this.selectedDependencies.indexOf(dependency);

    if (index >= 0) {
      this.selectedDependencies.splice(index, 1);
    }
  }

  dependencySelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedDependencies.push(event.option.value);
    this.dependencyCtrl.setValue(null);
  }


  isValidProject() {
    return this.formService.hasDataFor('project', this.starterForm) &&
      (this.formService.valueIs('project', 'Other', this.starterForm) && this.formService.hasDataFor('other', this.starterForm) ||
        this.formService.valueIsNot('project', 'Other', this.starterForm));
  }


  getAppNamePlaceholder(): string {
    return this.formService.valueIs('appType', this.AppType_INTEGRATION, this.starterForm) ? 'source-target' : 'app-name';
  }

  getFullAppName(): string {
    let fullAppName = this.formService.getValue('appType', this.starterForm).toLowerCase() + '-';
    fullAppName += this.formService.valueIs('appType', AppType.API, this.starterForm) ? this.getVersionedName()
      : this.formService.getValue('appName', this.starterForm);
    return fullAppName;
  }

  getVersionedName(): string {
    let versionedName =  this.formService.getValue('appName', this.starterForm);
    versionedName += this.formService.valueIs('appType', AppType.API, this.starterForm) ?
      '-v' + this.formService.getValue('version', this.starterForm) : '';
    return versionedName;
  }

  isOtherProject(): boolean {
    return this.formService.valueIs('project', 'Other', this.starterForm);
  }

  generate() {
    const formObj = this.starterForm.getRawValue();
    console.log('registerApp:', formObj.registerApp);

    const params = {};
    params['type'] = 'maven-project';
    params['packaging'] = 'jar';
    params['javaVersion'] = this.javaVersion;
    params['language'] = 'java';
    params['bootVersion'] = this.frameworkVersion;
    params['groupId'] = 'nz.ac.auckland';
    params['artifactId'] = this.getFullAppName();
    params['version'] = '0.0.1-SNAPSHOT';
    params['name'] = this.getFullAppName();
    params['description'] = formObj.appName;
    params['packageName'] = 'nz.ac.auckland.' + formObj.appName;
    const dependencies = this.selectedDependencies.map(dep => dep.id);
    params['dependencies'] = dependencies.join(',');

    this.starterService.generate(params).subscribe((data:any) => {
      const blob = new Blob([data], {
        type: 'application/zip',
      });

      if (navigator.msSaveBlob) {
        // Download the Zip file with correct file name IE11 & Edge
        navigator.msSaveBlob(blob, this.getFullAppName());
      } else {
        // Create invisible link to download the Zip file with correct file name
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', this.getFullAppName());
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, err => {
      console.log(err);
    });
  }

}
