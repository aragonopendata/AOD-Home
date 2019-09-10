import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatasetsAdminService } from '../../../../../services/admin/datasets-admin.service';
import { UsersAdminService } from '../../../../../services/admin/users-admin.service';
import { Dataset } from '../../../../../models/Dataset';
import { OrganizationAdmin } from '../../../../../models/OrganizationAdmin';
import { Topic } from '../../../../../models/Topic';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../../../../app.constants';
import {DialogModule, GrowlModule, Message} from 'primeng/primeng';
import { User } from 'app/models/User';

@Component({
	selector: 'app-datasets-admin-list',
	templateUrl: './datasets-admin-list.component.html',
	styleUrls: ['./datasets-admin-list.component.css']
})
export class DatasetsAdminListComponent implements OnInit {

	datasets: Dataset[];
    dataset: Dataset;
    datasetTitleDelete: string;
    datasetNameToDelete: string;
    
    currentUser: User;
    orgMemberRol: string;
    userOrgs: OrganizationAdmin[];

    msgs: Message[] = [];
    showProgressBar: boolean= true;
	
    searchValue: string = '';
    textValueToSearch: string;
    textSearch: string;
	sort: string;
	pageRows: number;
    numDatasets: number;
    routerLinkAdminDatacenterDatasetsEdit: string;
    routerLinkAdminDatacenterDatasetsShow: string;

	//Pagination Params
    pages: number[];
    actualPage: number;
    pagesShow: string[];
    pageFirst: number;
    pageLast: number;

	//Error Params
    errorTitle: string;
    errorMessage: string;
	datasetListErrorTitle: string;
    datasetListErrorMessage: string;

    displayDeleteDialog: boolean = false;
    

    constructor(private datasetsAdminService: DatasetsAdminService, private activatedRoute: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef, private usersAdminService: UsersAdminService) {
        this.pageRows = Constants.DATASET_ADMIN_LIST_ROWS_PER_PAGE;
        this.routerLinkAdminDatacenterDatasetsEdit = Constants.ROUTER_LINK_ADMIN_DATACENTER_DATASETS_EDIT;
        this.routerLinkAdminDatacenterDatasetsShow =  Constants.ROUTER_LINK_ADMIN_DATACENTER_DATASETS_SHOW;
        this.currentUser = this.usersAdminService.currentUser;
        this.orgMemberRol = Constants.ADMIN_USER_ROL_ORGANIZATION_MEMBER
	 }

	ngOnInit() {
		this.activatedRoute.queryParams.subscribe(params => {
            try {
                this.textSearch = params[Constants.ROUTER_LINK_DATA_PARAM_TEXT];
            } catch (error) {
                console.error('Error: ngOnInit() queryParams - datasets-list.component.ts');
            }
		});
        this.sort = Constants.ADMIN_SERVER_API_LINK_PARAM_SORT_DEFAULT_VALUE;
        this.loadUserOrgs();
    }
    
    loadUserOrgs(){
        this.usersAdminService.getOrganizationsByCurrentUser().subscribe(orgs => {
            try {
                this.userOrgs = JSON.parse(orgs).result;
                if (this.userOrgs.length != 0) {
                    this.loadDatasets();
                } else {
                    this.msgs.push({severity:'info', summary:'Aviso', detail:'No hay organizaciones asociadas a este usuario'});
                    this.datasets = [];
                    this.showProgressBar = false;
                }
                
            } catch (error) {
                console.error('Error: loadUserOrgs() - datasets-list.component.ts');
            }
        });
    }

	loadDatasets(){
		this.datasets = [];
        if (this.textSearch != undefined) {
            this.searchDatasetsByText(this.textSearch);
            this.searchValue = this.textSearch;
        } else{
            this.getDatasets(null,null);
		}
		
	}

	getDatasets(page: number, rows: number): void {
        var orgQuery = '';
        if(this.userOrgs){
            if (this.userOrgs.length > 1) {
                for (var i = 0; i < this.userOrgs.length; i++) {
                    var element = this.userOrgs[i];
                        orgQuery += this.userOrgs[i].name + ',';
                }
                orgQuery = orgQuery.slice(0, -1);
            }else{
                orgQuery += this.userOrgs[0].name;
            }

        }
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsAdminService.getDatasets(this.sort, pageNumber, rowsNumber, orgQuery).subscribe(datasets => {
            try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
                this.setPagination(pageNumber, this.numDatasets);
                this.showProgressBar = false;
            } catch (error) {
				console.error(error);
                console.error('Error: getDatasets() - datasets-admin-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });
	}

	getDatasetsBySearch(page: number, rows: number, searchParam: string): void {
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsAdminService.getDatasetsByText(this.sort, pageNumber, rowsNumber, searchParam).subscribe(datasets => {
            try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
                this.setPagination(pageNumber, this.numDatasets);
            } catch (error) {
                console.error('Error: getDatasetsBySearch() - datasets-admin-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });
    }
	
	searchDatasetsByText(searchParam: string) {
        this.datasets = [];
        this.textValueToSearch = searchParam;
        this.getDatasetsBySearch(null, null, searchParam);
	}
	
	setPagination(actual: number, total: number) {
        this.actualPage = actual;
        this.pageFirst = 0;
        this.pageLast = Math.ceil(+total / +this.pageRows);
        this.pages = [];
        this.pagesShow = [];
        if (this.pageLast == 0) {
            this.pagesShow.push('-');
        }
        for (var index = 0; index < this.pageLast; index++) {
            this.pages.push(+index + 1);
        }
        if (this.actualPage < 4) {
            for (var index = 0; index < 5; index++) {
                if (this.pages[index]) {
                    this.pagesShow.push(String(+this.pages[index]));
                }
            }
        } else if (this.actualPage >= (135)) {
            for (var index = (+this.pageLast - 5); index < this.pageLast; index++) {
                if (this.pages[index]) {
                    this.pagesShow.push(String(+this.pages[index]));
                }
            }
        } else {
            for (var index = (+actual - 2); index <= (+this.actualPage + 2); index++) {
                if (this.pages[index]) {
                    this.pagesShow.push(String(+this.pages[index]));
                }
            }
        }
	}
	
	paginate(page: number) {
        --page;
        if (this.textValueToSearch) {
            this.getDatasetsBySearch(page, this.pageRows, this.textValueToSearch);
        } else {
            this.getDatasets(page, this.pageRows);
        }
        document.body.scrollTop = 0;
    }

    setOrder(event) {
        event.page = 0;
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
        this.loadDatasets();
        this.changeDetectorRef.detectChanges();
    }

	showDataset(dataset: Dataset) {
		this.datasetsAdminService.setDataset(dataset);
	}

	addDataset() {
		this.dataset = new Dataset();
		this.datasetsAdminService.setDataset(this.dataset);
    }
    
    showDeleteDialog(datasetTitle: string, datasetName: string){
        this.datasetTitleDelete = datasetTitle;
        this.displayDeleteDialog = true;
        this.datasetNameToDelete = datasetName;
    }

    deleteDataset(){
        this.displayDeleteDialog=false;
        let user_id = this.usersAdminService.currentUser.id;
        let user_name = this.usersAdminService.currentUser.username;

        this.datasetsAdminService.getDatasetByName(this.datasetNameToDelete).subscribe( response => {
            let dataset = JSON.parse(response).result;

            this.datasetsAdminService.removeDataset(this.datasetNameToDelete,user_name, user_id, dataset.id).subscribe( response => {
                this.msgs = [];
                this.msgs.push({severity:'info', summary:'Dataset Borrado', detail:'Dataset borrado correctamente'});
                this.loadDatasets();
            });
        });
    
    }

    undoDeleteDataset(){
        this.displayDeleteDialog=false;
        this.datasetNameToDelete = undefined;
    }

}
