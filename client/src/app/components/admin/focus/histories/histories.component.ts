import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { FocusAdminService } from 'app/services/admin/focus-admin.service';
import { Constants } from 'app/app.constants';
import { State } from 'app/models/State';
import { History } from 'app/models/History';

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
  action: string;
  displayActionDialog: boolean = false;
  idHistory: string;
  history;

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
    this.showProgressBar = true;
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
    }, err=>{
      this.histories = [];
      this.numHistories=0;
      this.showProgressBar = false;
    });
  }

  public hideHistory(id){
    this.history = null;
    this.action = null;
    this.focusAdminService.hideHistory(id).subscribe(result => {
      if(result.success){
        //Mensajes success
        this.getHistories(this.actualPage, null);
      }
      else{
        //Mensajes error
      }
    });
  }

  returnToBorrador(history){
    this.history = null;
    this.action = null;
    this.focusAdminService.returnToBorrador(history).subscribe(result => {
      if(result.success){
        //Mensajes success
        this.getHistories(this.actualPage, null);
        history.urlEmail=window["config"]["FOCUS_URL"] + Constants.ROUTER_LINK_EDIT_HISTORY + "/" + history.token;
        if(history.email!=null){
          this.focusAdminService.sendReturnToBorradorUserMail(history).subscribe(result => {
            if(result.status==200){
              //mail enviado correctamente
              console.log('mail enviado')
            }else{
              console.log('error envio mail!')
            }
          }, err =>{
            console.log('error envio mail con error!')
          });
        }
      }
      else{
        //Mensajes error
      }
    });
  }

  publishHistory(history){
    this.history = null;
    this.action = null;
    this.focusAdminService.publishHistory(history).subscribe(result => {      
      if(result.success){
        this.getHistories(this.actualPage, null);
        history.urlEmail=window["config"]["FOCUS_URL"] + Constants.ROUTER_LINK_VIEW_HISTORY + "/" + history.url;
        if(history.email!=null){
          this.focusAdminService.sendPublicUserMail(history).subscribe(result => {
            if(result.status==200){
              //mail enviado correctamente
              console.log('mail enviado')
            }else{
              console.log('error envio mail!')
            }
          }, err =>{
            console.log('error envio mail con error!')
          });
        }
      }
      else{
        console.log('no se ha podido publicar');
      }
    });
  }

  showDeleteDialog(id){
    this.displayDeleteDialog = true;
    this.idHistory=id;
  }

  deleteHistory(){
    this.displayDeleteDialog = false;
    this.focusAdminService.deleteHistory(this.idHistory).subscribe(result => {
      if(result.success){
        this.getHistories(this.actualPage, null);
      }
      else{
        console.log('no se ha podido eliminar')
      }
    })
  }

  cancelDeleteHistory(){
    this.action = null;
    this.displayDeleteDialog = false;
  }

  showActionDialog(action, history) {
    this.displayActionDialog = true;
    this.action = action;
    this.history = history

  }
  doAction() {
    if (this.action === 'hideHistory'){
      this.hideHistory(this.history.id);
    } else if ( this.action === 'publishHistory' ){
      this.publishHistory(this.history)
    }else if ( this.action === 'returnToBorrador' ){
      this.returnToBorrador(this.history)
    }
    this.displayActionDialog = false;
  }

  cancelAction(){
    this.history = null;
    this.displayActionDialog = false;
  }

  searchHistoriesByText(searchText: string){
    this.histories=[];
    this.textSearch=searchText;
    this.getHistories(null, null)
  }

  previewHistory(url){
    window.open( window["config"]["FOCUS_URL"] + '/history/' + url);
  }

  editHistory(token){
    let url = window["config"]["FOCUS_URL"];
    window.open( url + '/editHistory/' + token );
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
    this.showProgressBar = true;


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

