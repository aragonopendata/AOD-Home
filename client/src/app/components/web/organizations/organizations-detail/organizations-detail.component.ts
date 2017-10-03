import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Organization } from '../../../../models/Organization';
import { OrganizationsService } from '../../../../services/web/organizations.service';
import { DatasetsService } from '../../../../services/web/datasets.service';
import { Dataset } from '../../../../models/Dataset';
import { Constants } from '../../../../app.constants';

@Component({
	selector: 'app-organizations-detail',
	templateUrl: './organizations-detail.component.html',
	styleUrls: ['./organizations-detail.component.css']
})

export class OrganizationsDetailComponent implements OnInit {

	org: Organization = new Organization();
	webpage: string;
	address: string;
	person: string;
	email: string;
	sort: string;
	datasets: Dataset[];
	numDatasets: number;
	param = { ocurrences: Constants.DATASET_HIGLIGHT_OCURRENCES, days: Constants.DATASET_HIGLIGHT_DAYS };
	//Dynamic URL build parameters
	routerLinkDataCatalogDataset: string;

	constructor(private organizationsService: OrganizationsService
			, private datasetsService: DatasetsService
			, private activatedRoute: ActivatedRoute) {
		this.routerLinkDataCatalogDataset = '/' + Constants.ROUTER_LINK_DATA_CATALOG_DATASET;
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			this.org.name = params[Constants.ROUTER_LINK_DATA_PARAM_ORGANIZATION_NAME];
		});
		this.organizationsService.getOrganizationByName(this.org.name).subscribe(org => {
			this.sort = Constants.SERVER_API_LINK_PARAM_SORT_DEFAULT_VALUE;
			this.org = JSON.parse(org).result;
			this.getExtras();
			this.getEmail();
			this.getDatasets(null, null);
		});
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

	getEmail(): void {
		//person from users
		if (this.org.users !== undefined) {
			for (let user of this.org.users) {
				if (!user.sysadmin) {
					this.email = user.email;
					break;
				}
			}
		}
	}

	getDatasets(page: number, rows: number): void {
		var pageNumber = (page != null ? page : 0);
		var rowsNumber = (rows != null ? rows : Constants.DATASET_LIST_ROWS_PER_PAGE);
		this.datasetsService.getDatasetsByOrganization(this.org.name, this.sort, pageNumber, rowsNumber, null).subscribe(datasets => {
			this.datasets = JSON.parse(datasets).result.results;
			this.numDatasets = JSON.parse(datasets).result.count;
		});
	}

	showDataset(dataset: Dataset) {
		this.datasetsService.setDataset(dataset);
	}

	paginate(event) {
		this.getDatasets(event.page, event.rows);
		document.body.scrollTop = 0;
	}

	setOrder(event) {
		console.log("order");
		switch (event.field) {
            case Constants.DATASET_LIST_SORT_COLUMN_NAME:
            this.sort == Constants.SERVER_API_LINK_PARAM_SORT_TITLE_STRING 
                ? this.sort = '-' + Constants.SERVER_API_LINK_PARAM_SORT_TITLE_STRING 
                : this.sort = Constants.SERVER_API_LINK_PARAM_SORT_TITLE_STRING;
            break;
        case Constants.DATASET_LIST_SORT_COLUMN_ACCESS:
            this.sort == Constants.SERVER_API_LINK_PARAM_SORT_VIEWS_TOTAL 
                ? this.sort = '-' + Constants.SERVER_API_LINK_PARAM_SORT_VIEWS_TOTAL 
                : this.sort = Constants.SERVER_API_LINK_PARAM_SORT_VIEWS_TOTAL;
            break;
        case Constants.DATASET_LIST_SORT_COLUMN_LAST_UPDATE:
            this.sort == Constants.SERVER_API_LINK_PARAM_SORT_METADATA_MODIFIED 
                ? this.sort = '-' + Constants.SERVER_API_LINK_PARAM_SORT_METADATA_MODIFIED 
                : this.sort = Constants.SERVER_API_LINK_PARAM_SORT_METADATA_MODIFIED;
                break;
		}
		this.datasets = [];
        this.getDatasets(null, null);
	}
}
