import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Constants } from '../../../../../app.constants';
import { OrganizationAdmin } from '../../../../../models/OrganizationAdmin'
import { OrganizationsAdminService } from '../../../../../services/admin/organizations-admin.service';

@Component({
  selector: 'app-organizations-admin-edit',
  templateUrl: './organizations-admin-edit.component.html',
  styleUrls: ['./organizations-admin-edit.component.css']
})
export class OrganizationsAdminEditComponent implements OnInit {

  org: OrganizationAdmin = new OrganizationAdmin();
  sort: string;
  webpage: string;
	address: string;
	person: string;
	email: string;

  constructor(private organizationsAdminService: OrganizationsAdminService
          , private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.org.name = params[Constants.ROUTER_LINK_DATA_PARAM_ORGANIZATION_NAME];
    });
    if(this.org.name != null){
      this.loadOrganization();
    }
  }

  getExtras(): void {
		//webpage, address and person from extras
		if (this.org.extras !== undefined) {
			for (let extra of this.org.extras) {
				if (extra.key === Constants.ORGANIZATION_EXTRA_WEBPAGE) {
          this.webpage = extra.value;
				} else if (extra.key === Constants.ORGANIZATION_EXTRA_ADDRESS) {
					this.address = extra.value;
				} else if (extra.key === Constants.ORGANIZATION_EXTRA_PERSON) {
					this.person = extra.value;
				}
			}
		}
  }

  loadOrganization(){
    this.organizationsAdminService.getOrganizationByName(this.org.name).subscribe(org => {
      try{
        this.sort = Constants.SERVER_API_LINK_PARAM_SORT_DEFAULT_VALUE;
        this.org = JSON.parse(org).result;
        this.getExtras();
      }catch(error){
        console.error("Error: ngOnInit() - organizations-admin-edit.component.ts");
      }
    });
  }

  // initializeOrganization(){
    
  // }
}
