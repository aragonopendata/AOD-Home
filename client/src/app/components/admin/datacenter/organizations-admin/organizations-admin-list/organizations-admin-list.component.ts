import { Component, OnInit } from '@angular/core';
import { OrganizationAdmin } from '../../../../../models/OrganizationAdmin'
import { OrganizationsAdminService } from '../../../../../services/admin/organizations-admin.service';

@Component({
	selector: 'app-organizations-admin',
	templateUrl: './organizations-admin-list.component.html',
	styleUrls: ['./organizations-admin-list.component.css']
})
export class OrganizationsAdminListComponent implements OnInit {

	orgs: OrganizationAdmin[] = [];

	constructor(private organizationsAdminService: OrganizationsAdminService) {	}

	ngOnInit() {
		this.getOrgs();
	 }

	 getOrgs(): void {
		this.organizationsAdminService.getOrganizations().subscribe(orgs => {
			try {
				this.orgs = JSON.parse(orgs).result;
			} catch (error) {
				console.error("Error: getOrgs() - organizations-list.component.ts");
			}
		});
	}
}
