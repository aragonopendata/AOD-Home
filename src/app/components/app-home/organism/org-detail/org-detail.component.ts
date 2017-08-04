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

  org: Org;
  datasets: Dataset[];

  constructor(private orgsService: OrgsService, private datasetService: DatasetService) { }

  ngOnInit() {
    //this.datasets = this.datasetService.getDatasets();
    this.org = this.orgsService.getOrg();
  }

}
