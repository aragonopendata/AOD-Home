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
  webpage: string;
  address: string;
  person: string;
  email: string;

  constructor(private orgsService: OrgsService, private datasetService: DatasetService) { }

  ngOnInit() {
    //this.datasets = this.datasetService.getDatasets();
    //this.org = this.orgsService.getOrg();
    this.orgsService.getOrg().subscribe(org => {
      this.org = JSON.parse(org).result;
      //webpage, address and person from extras
      if(this.org.extras !== undefined){
        for (let extra of this.org.extras) {
          if (extra.key === 'webpage') {
            if(extra.value === undefined || extra.value == ''){
              this.webpage = 'No disponible';
            }else{
              this.webpage = extra.value;
            }
          }else if(extra.key === 'address'){
            if(extra.value == undefined || extra.value == ''){
              this.address = 'No disponible';
            }else{
              this.address = extra.value;
            }
          }else if(extra.key === 'person'){
            if(extra.value == undefined || extra.value == ''){
              this.person = 'No disponible';
            }else{
              this.person = extra.value;
            }
          }
        }
      }
      //person from users
      if(this.org.users !== undefined){
        for (let user of this.org.users) {
          //if (user.name === 'xxx') {
            if(user.email == undefined || user.email == ''){
              this.email = 'No disponible';
            }else{
              this.email = user.email;
            }
          //}
        }
      }

    });
  }

}
