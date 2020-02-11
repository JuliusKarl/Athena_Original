import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-apis-list',
  templateUrl: './apis-list.component.html',
  styleUrls: ['./apis-list.component.css']
})
export class ApisListComponent implements OnInit {
  searchText: string;
  loadingApis = false;
  loadingApisErr = false;
  apiMap: any[];
  apiStats = {proxyApis: 0, nonProxyApis: 0, standardApis: 0, nonStandardApis: 0};

  constructor( private apiService: ApiService, private route: ActivatedRoute) {
    this.loadData();
  }

  loadData(): void {
    this.loadingApis = true;
    this.route.params.subscribe(params => {
      this.apiService.groupApis().subscribe( (apiMap: any[]) => {
          console.log(apiMap);
          this.apiMap = apiMap;
          this.loadingApis = false;
        }, error => {
          this.loadingApisErr = true;
          this.loadingApis = false;
        }
      );
    });
  }

  refreshList(): void {
    this.loadData();
  }

  ngOnInit() {}

  checkForNonStandard(project, check) {
    if (project.isProxy) {
        return false;
    }
    return !project[check];
  }
}
