import { Component, OnInit } from '@angular/core';

import { History } from '../../../../models/History';
import { FocusAdminService } from 'app/services/admin/focus-admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from 'app/app.constants';

@Component({
  selector: 'app-histories',
  templateUrl: './histories.component.html',
  styleUrls: ['./histories.component.css']
})
export class HistoriesComponent implements OnInit {

  histories: History[];

  showProgressBar: boolean= true;

	/*sort: string;
  pageRows: number;
  numHistories: number;*/

  //Pagination Params
  /*pages: number[];
  actualPage: number;
  pagesShow: string[];
  pageFirst: number;
  pageLast: number;*/


  displayDeleteDialog: boolean = false;

  constructor(private focusAdminService: FocusAdminService, private activatedRoute: ActivatedRoute) {
    //this.pageRows = Constants.DATASET_ADMIN_LIST_ROWS_PER_PAGE;
   }

  ngOnInit() {
    //this.sort = Constants.ADMIN_SERVER_API_LINK_PARAM_SORT_DEFAULT_VALUE;
    this.getHistories();
    //this.getHistories(null, null);
  }

  public getHistories(){
    
    this.histories = [];
    this.focusAdminService.getHistories().subscribe(result => {
        try {
            this.histories = result.history;
            this.showProgressBar = false;
        } catch (error) {
            console.error(error);
            console.error('Error: getDatasets() - datasets-admin-list.component.ts');
        }
    });
  }

  /*public getHistories(page: number, rows: number){
    
    this.histories = [];
    var pageNumber = (page != null ? page : 0);
    var rowsNumber = (rows != null ? rows : this.pageRows);
    this.focusAdminService.getHistories(this.sort, pageNumber, rowsNumber).subscribe(result => {
        try {
            this.histories = result.history;
            this.numHistories = result.history.length;
            this.setPagination(pageNumber,this.numHistories);
            this.showProgressBar = false;
        } catch (error) {
            console.error(error);
            console.error('Error: getDatasets() - datasets-admin-list.component.ts');
        }
    });
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
  }*/

}
