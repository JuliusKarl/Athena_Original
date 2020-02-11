import {Component, OnInit} from '@angular/core';
import {MetadataService} from '../common/services/metadata.service';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-bom-layout',
  templateUrl: './flow-layout.component.html',
  styleUrls: ['./flow-layout.component.css']
})
export class FlowLayoutComponent implements OnInit {


  searchText = new FormControl();
  searchResults: string[];
  notFound: boolean;

  constructor(private bomService: MetadataService, private router: Router) {
  }

  ngOnInit() {}

  searchApp(event): void {
    const searchText = event.target.value;
    if (searchText.length === 0) {
      this.searchResults = [];
      return;
    }
    this.bomService.searchApp(searchText).subscribe(
      results => {
        this.notFound = false;;
        this.searchResults = results;
        if ( results && results.length === 0) {
          this.searchResults = ['No application found containing "' + searchText + '"'];
          this.notFound = true;
        }
        console.log(this.searchResults);
      }, error => {
        this.searchResults = ['Unable to search applications :('];
        this.notFound = true;
      }
    );
  }

  getBom(appName: string) {
    if (this.notFound) {
      return;
    }
    console.log('show ', appName);
    this.searchText.setValue('');
    this.searchResults = [];
    this.router.navigate(['flow', appName]);
  }

  showCancel() {
    return this.searchText.value;
  }

  clear() {
    this.searchText.setValue('');
    this.searchResults = [];
  }
}
