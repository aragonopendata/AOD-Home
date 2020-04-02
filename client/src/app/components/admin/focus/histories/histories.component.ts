import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { FocusAdminService } from 'app/services/admin/focus-admin.service';
import { Constants } from 'app/app.constants';
import { State } from 'app/models/State';

@Component({
  selector: 'app-histories',
  templateUrl: './histories.component.html',
  styleUrls: ['./histories.component.css']
})
export class HistoriesComponent implements OnInit {

  histories: History[];

  showProgressBar: boolean= true;

  sort: string;
  pageRows: number;
  numHistories: number;

  //Pagination Params
  pages: number[];
  actualPage: number;
  pagesShow: string[];
  pageFirst: number;
  pageLast: number;
  textSearch:string="";
  stateEnum: typeof State = State;

  //Error Params
  errorTitle: string;
  errorMessage: string;
  datasetListErrorTitle: string;
  datasetListErrorMessage: string;

  displayDeleteDialog: boolean = false;

  constructor(private focusAdminService: FocusAdminService, private changeDetectorRef: ChangeDetectorRef) {
    this.pageRows = Constants.DATASET_ADMIN_LIST_ROWS_PER_PAGE;
    this.sort = Constants.FOCUS_SORT_COLUMN_NAME_CREATE_DATE + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_DESC;
    this.pageRows = 5;

  }

  ngOnInit() {
    //this.sort = Constants.ADMIN_SERVER_API_LINK_PARAM_SORT_DEFAULT_VALUE;
    this.getHistories(null, null);
  }

  public getHistories(page: number, rows: number){
    
    this.histories = [];
    var pageNumber = (page != null ? page : 0);
    var rowsNumber = (rows != null ? rows : this.pageRows);
    this.focusAdminService.getHistories(this.sort,rowsNumber,pageNumber,this.textSearch).subscribe(result => {
        try {
            this.histories = result.histories.list;
            this.numHistories = result.histories.numHistories;
            this.setPagination(pageNumber,this.numHistories);
            this.showProgressBar = false;
        } catch (error) {
            console.error(error);
            console.error('Error: getDatasets() - datasets-admin-list.component.ts');
        }
    });
  }

  public deleteHistory(id){
    this.focusAdminService.deleteHistory(id).subscribe(result => {
      console.log(result.history);
      console.log('result.history');
    });
  }

  searchHistoriesByText(searchText: string){
    this.histories=[];
    this.textSearch=searchText;
    this.getHistories(null, null)
  }

  previewHistory(id){
    let url = window["config"]["AOD_BASE_URL"] + '/servicios/focus';
    window.open( url + '/viewHistory/'  +id );
  }

  editHistory(id){
    let url = window["config"]["AOD_BASE_URL"] + '/servicios/focus';
    window.open( url + '/editHistory/'  +id );
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
    this.getHistories(page, this.pageRows);
    document.body.scrollTop = 0;
  }

  setOrder(event) {

    event.page = 0;

    switch (event.field) {
        case Constants.FOCUS_SORT_COLUMN_NAME_TITLE:
            if( this.sort === Constants.FOCUS_SORT_COLUMN_NAME_TITLE + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_ASC ){
              this.sort = Constants.FOCUS_SORT_COLUMN_NAME_TITLE + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_DESC
            } else {
              this.sort = Constants.FOCUS_SORT_COLUMN_NAME_TITLE + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_ASC
            }
            break;
        case Constants.FOCUS_SORT_COLUMN_NAME_STATE:
            if( this.sort === Constants.FOCUS_SORT_COLUMN_NAME_STATE + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_ASC ){
              this.sort = Constants.FOCUS_SORT_COLUMN_NAME_STATE + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_DESC
            } else {
              this.sort = Constants.FOCUS_SORT_COLUMN_NAME_STATE + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_ASC
            }
            break;
        case Constants.FOCUS_SORT_COLUMN_NAME_EMAIL:
            if( this.sort === Constants.FOCUS_SORT_COLUMN_NAME_EMAIL + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_ASC ){
              this.sort = Constants.FOCUS_SORT_COLUMN_NAME_EMAIL + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_DESC
            } else {
              this.sort = Constants.FOCUS_SORT_COLUMN_NAME_EMAIL + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_ASC
            }
            break;
        case Constants.FOCUS_SORT_COLUMN_NAME_CREATE_DATE:
            if( this.sort === Constants.FOCUS_SORT_COLUMN_NAME_CREATE_DATE + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_DESC ){
              this.sort = Constants.FOCUS_SORT_COLUMN_NAME_CREATE_DATE + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_ASC
            } else {
              this.sort = Constants.FOCUS_SORT_COLUMN_NAME_CREATE_DATE + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_DESC
            }
            break;
        case Constants.FOCUS_SORT_COLUMN_NAME_UPDATE_DATE:
            if( this.sort === Constants.FOCUS_SORT_COLUMN_NAME_UPDATE_DATE + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_DESC ){
              this.sort = Constants.FOCUS_SORT_COLUMN_NAME_UPDATE_DATE + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_ASC
            } else {
              this.sort = Constants.FOCUS_SORT_COLUMN_NAME_UPDATE_DATE + ' ' + Constants.FOCUS_SORT_COLUMN_TYPE_DESC
            }
          break;
    }

    this.getHistories(null, null);
    this.changeDetectorRef.detectChanges();
  }

}

