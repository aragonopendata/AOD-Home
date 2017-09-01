import { Component, OnInit } from '@angular/core';
import { Org } from '../../../../models/Org'
import { OrgsService } from "../../../../services/orgs/orgs.service";

@Component({
  selector: 'app-orgs',
  templateUrl: './orgs.component.html',
  styleUrls: ['./orgs.component.css']
})
export class OrgsComponent implements OnInit {

  displayDialog: boolean = false;
  displayDialogEdit: boolean = false;
  selectedOrg: Org;
  orgs: Org[] = [];
  results: Org[];


  constructor(private orgService: OrgsService) {
//    this.orgs = orgService.getOrgs();
//    this.results = this.orgs;
  }

  ngOnInit() { }

  selectOrg(org: Org) {
    this.selectedOrg = org;
    this.displayDialog = true;
  }

  enableEdition() {
    this.displayDialogEdit = true;
    this.displayDialog = false;
  }

  search(event) {
    let query = event.query;
    console.log(query);
    if(query == ""){
      this.results = this.orgs;
    }else {
      this.results = [];
    }
    for(let i = 0; i < this.orgs.length; i++){
      if(this.orgs[i].title.search(query) != -1) {
        this.selectedOrg = this.orgs[i];
        this.results.push(this.selectedOrg);
      }
    }
    console.log(this.results);
  }
}
