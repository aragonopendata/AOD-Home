import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Organization } from '../../../../models/Organization';
import { OrganizationsService } from '../../../../services/web/organizations.service';
import { Constants } from '../../../../app.constants';

@Component({
	selector: 'app-organizations-list',
	templateUrl: './organizations-list.component.html',
	styleUrls: ['./organizations-list.component.css']
})

export class OrganizationsListComponent implements OnInit {

	views: SelectItem[];
	selectedView: boolean = true;

	orgs: Organization[];
	hovers: any[] = [];

	//Dynamic URL build parameters
	routerLinkDataOrganizations: string;
	assetsUrl: string;

	constructor(private orgService: OrganizationsService) {
		this.routerLinkDataOrganizations = Constants.ROUTER_LINK_DATA_ORGANIZATIONS;
		this.assetsUrl = Constants.AOD_ASSETS_BASE_URL;
	}

	ngOnInit() {
		//this.orgs = this.orgService.getOrgs();
		//this.setHovers(this.orgs);
		this.getOrgs();

		this.views = [];
		this.views.push({ label: Constants.ORGANIZATION_COMBO_VIEWS_LIST_OPTION, value: false });
		this.views.push({ label: Constants.ORGANIZATION_COMBO_VIEWS_CARD_OPTION, value: true });
	}

	setHovers(orgs: Organization[]) {
		for (let org of orgs) {
			this.hovers.push({ label: org.title, hover: false });
		}
	}

	setHover(name, index) {
		for (let hover of this.hovers) {
			if (hover.label === name) {
				hover.hover = !hover.hover;
			}
		}
	}

	unsetHover(name, index) {
		for (let hover of this.hovers) {
			if (hover.label === name) {
				hover.hover = !hover.hover;
			}
		}
	}

	showOrg(org: Organization) {
		this.orgService.setOrganization(org);
	}

	getOrgs(): void {
		this.orgService.getOrganizations().subscribe(orgs => {
			this.orgs = JSON.parse(orgs).result;
			this.setHovers(this.orgs);
		});
	}

}
