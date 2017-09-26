import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Organization } from '../../../../models/Organization';
import { OrganizationsService } from '../../../../services/web/organizations.service';
import { DatasetsService } from '../../../../services/web/datasets.service';
import { Dataset } from '../../../../models/Dataset';
import { ConstantsService } from '../../../../app.constants';

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
	param = { ocurrences: '10', days: '14' };
	pageRows: number;

	constructor(private organizationsService: OrganizationsService
			  , private datasetsService: DatasetsService
			  , private constants: ConstantsService
			  , private activatedRoute: ActivatedRoute) {
		this.pageRows = constants.DATASET_LIST_ROWS_PER_PAGE;
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			this.org.name =  params['organizationName'];
		});
		this.organizationsService.getOrganizationByName(this.org.name).subscribe(org => {
			this.sort = 'relevance,-metadata_modified';
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
				if (extra.key === 'webpage') {
					this.webpage = extra.value;
				} else if (extra.key === 'address') {
					this.address = extra.value;
				} else if (extra.key === 'person') {
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
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsByOrganization(this.org.name, this.sort, pageNumber, rowsNumber,null).subscribe(datasets => {
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

}
