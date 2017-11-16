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
	pageRows: number;
	numDatasets: number;
	param = { ocurrences: Constants.DATASET_HIGLIGHT_OCURRENCES, days: Constants.DATASET_HIGLIGHT_DAYS };
	//Dynamic URL build parameters
	routerLinkDataCatalogDataset: string;
	routerLinkFacebookShare: string;
	routerLinkTwitterShare: string;
	routerLinkGooglePlusShare: string;
	assetsUrl: string;
	 //Pagination Params
	 pages: number [];
	 actualPage:number;
	 pagesShow: string[];
	 pageFirst: number;
	 pageLast: number;
	 //Error Params
	 errorTitle: string;
	 errorMessage: string;

	constructor(private organizationsService: OrganizationsService
			, private datasetsService: DatasetsService
			, private activatedRoute: ActivatedRoute) {
		this.assetsUrl = Constants.AOD_ASSETS_BASE_URL;
		this.routerLinkDataCatalogDataset = '/' + Constants.ROUTER_LINK_DATA_CATALOG_DATASET;
		this.pageRows = Constants.ORGANIZATION_DATASET_LIST_ROWS_PER_PAGE;
		this.routerLinkFacebookShare = Constants.SHARE_FACEBOOK + window.location.href;
		this.routerLinkTwitterShare = Constants.SHARE_TWITTER + window.location.href;
		this.routerLinkGooglePlusShare = Constants.SHARE_GOOGLE_PLUS + window.location.href;
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			this.org.name = params[Constants.ROUTER_LINK_DATA_PARAM_ORGANIZATION_NAME];
		});
		this.organizationsService.getOrganizationByName(this.org.name).subscribe(org => {
			try {
				this.sort = Constants.SERVER_API_LINK_PARAM_SORT_DEFAULT_VALUE;
				this.org = JSON.parse(org).result;
				this.getExtras();
				//this.getEmail();
				this.getDatasets(null, null);
			} catch (error) {
				console.error("Error: ngOnInit() - organizations-detail.component.ts");
				this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Publicadores, vuelva a intentarlo y si el error persiste contacte con el administrador.";
			}
		});
	}

	setPagination(actual: number, total: number){
        this.actualPage = actual;
        this.pageFirst = 0;
        this.pageLast = Math.ceil(+total/+this.pageRows);        
        this.pages = [];
        this.pagesShow = [];
        if(this.pageLast == 0){
            this.pagesShow.push('-');   
        }
        for (var index = 0; index < this.pageLast; index++) {
            this.pages.push(+index+1);   
        }
        if (this.actualPage<4) {
            for (var index = 0; index < 5; index++) {
                if(this.pages[index]){
                    this.pagesShow.push(String (+this.pages[index]));
                }
            }
        } else if (this.actualPage >= (135)) {
            for (var index = (+this.pageLast-5); index < this.pageLast; index++) {
                if(this.pages[index]){
                    this.pagesShow.push(String (+this.pages[index]));
                }
            }
        } else{
            for (var index = (+actual-2); index <= (+this.actualPage+2); index++) {
                if(this.pages[index]){
                    this.pagesShow.push(String (+this.pages[index]));
                }
            }
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

	// getEmail(): void {
	// 	//person from users
	// 	if (this.org.users !== undefined) {
	// 		for (let user of this.org.users) {
	// 			if (!user.sysadmin) {
	// 				this.email = user.email;
	// 				break;
	// 			}
	// 		}
	// 	}
	// }

	getDatasets(page: number, rows: number): void {
		var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
		this.setPagination(pageNumber,this.numDatasets);
		this.datasetsService.getDatasetsByOrganization(this.org.name, this.sort, pageNumber, rowsNumber, null).subscribe(datasets => {
			try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
				this.setPagination(pageNumber,this.numDatasets);
			} catch (error) {
				console.error("Error: getDatasets() - organizations-detail.component.ts");
				this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
			}
			
		});
	}

	showDataset(dataset: Dataset) {
		this.datasetsService.setDataset(dataset);
	}

	paginate(page:number) {
		--page;
		this.getDatasets(page, this.pageRows);
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
