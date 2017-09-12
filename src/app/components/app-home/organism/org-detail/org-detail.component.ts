import { Component, OnInit } from '@angular/core';
import { OrgsService } from "../../../../services/orgs/orgs.service";
import { Org } from "../../../../models/Org";
import { DatasetService } from "../../../../services/dataset/dataset.service";
import { Dataset } from "../../../../models/Dataset";

@Component({
  selector: 'app-org-detail',
  templateUrl: './org-detail.component.html',
  styleUrls: ['./org-detail.component.css']
})

export class OrgDetailComponent implements OnInit {

  org: Org = new Org();
  webpage: string;
  address: string;
  person: string;
  email: string;
  datasets: Dataset[];
  numDatasets: number;
  param = {ocurrences: '10', days: '14'};

  constructor(private orgsService: OrgsService, private datasetService: DatasetService) { }

  ngOnInit() {
    this.orgsService.getOrg().subscribe(org => {
      this.org = JSON.parse(org).result;
      this.getExtras();
      this.getEmail();
      this.getDatasets();
    });
  }

  getExtras(): void {
    //webpage, address and person from extras
    if(this.org.extras !== undefined){
      for (let extra of this.org.extras) {
        if (extra.key === 'webpage') {
          this.webpage = extra.value;
        }else if(extra.key === 'address'){
          this.address = extra.value;
        }else if(extra.key === 'person'){
          this.person = extra.value;
        }
      }
    }
  }

  getEmail(): void {
    //person from users
    if(this.org.users !== undefined){
      for (let user of this.org.users) {
        if (!user.sysadmin) {
          this.email = user.email;
          break;
        }
      }
    }
  }

  getDatasets(): void {
    this.datasetService.getDatasetsByOrganization(this.org.name, 20, 0).subscribe(datasets => {
      this.datasets = JSON.parse(datasets).result.results;
      this.numDatasets = JSON.parse(datasets).result.count;
    });
  }

  showDataset(dataset: Dataset) {
    this.datasetService.setDataset(dataset);
  }

  paginate(event) {
    this.datasetService.getDatasetsByOrganization(this.org.name, event.rows, event.page).subscribe(datasets => {
      this.datasets = JSON.parse(datasets).result.results;
      this.numDatasets = JSON.parse(datasets).result.count;
    });
    document.body.scrollTop = 0;
  }
  
}
