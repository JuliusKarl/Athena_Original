import {Component, OnInit} from '@angular/core';
import {MetadataService} from '../../common/services/metadata.service';

@Component({
  selector: 'app-core-apps',
  templateUrl: './core-apps.component.html',
  styleUrls: ['./core-apps.component.css', '../flow-layout.component.css']
})
export class CoreAppsComponent implements OnInit {

  coreApps: string[];

  constructor(private bomService: MetadataService) { }

  ngOnInit() {
    this.bomService.getCoreApps().subscribe(coreApps => this.coreApps = coreApps);
  }

}
