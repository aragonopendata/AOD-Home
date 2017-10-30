import { Component, OnInit } from '@angular/core';
import { OrganizationAdmin } from '../../../../models/OrganizationAdmin'
import { OrganizationsAdminService } from '../../../../services/admin/organizations-admin.service';

@Component({
	selector: 'app-organizations-admin',
	templateUrl: './organizations-admin.component.html',
	styleUrls: ['./organizations-admin.component.css']
})
export class OrganizationsAdminComponent implements OnInit {

	displayDialog: boolean = false;
	displayDialogEdit: boolean = false;
	//selectedOrg: Organization;
	orgs: OrganizationAdmin[] = [];
	results: OrganizationAdmin[];


	constructor(private organizationsAdminService: OrganizationsAdminService) {
		    this.orgs = organizationsAdminService.getOrganizations();
		    this.results = this.orgs;
	}

	ngOnInit() {
		
	 }

	// selectOrg(org: Organization) {
	// 	this.selectedOrg = org;
	// 	this.displayDialog = true;
	// }

	// enableEdition() {
	// 	this.displayDialogEdit = true;
	// 	this.displayDialog = false;
	// }

	// search(event) {
	// 	let query = event.query;
	// 	console.log(query);
	// 	if (query == '') {
	// 		this.results = this.orgs;
	// 	} else {
	// 		this.results = [];
	// 	}
	// 	for (let i = 0; i < this.orgs.length; i++) {
	// 		if (this.orgs[i].title.search(query) != -1) {
	// 			this.selectedOrg = this.orgs[i];
	// 			this.results.push(this.selectedOrg);
	// 		}
	// 	}
	// 	console.log(this.results);
	// }

}
