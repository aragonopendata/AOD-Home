import { SelectItem } from 'primeng/primeng';
import { Event } from './../../../../../models/campus/Event';
import { Content } from './../../../../../models/campus/Content';
import { ActivatedRoute } from '@angular/router';
import { Constants } from './../../../../../app.constants';
import { CampusService } from './../../../../../services/web/campus.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { forEach } from '@angular/router/src/utils/collection';
import { UtilsService } from '../../../../../services/web/utils.service';

@Component({
	selector: 'app-campus',
	templateUrl: './campus.component.html',
	styleUrls: ['./campus.component.css']
})
export class CampusComponent implements OnInit {

    openedMenu: boolean;

	eventsList: Event[];
	eventsPerPage:number = 10;
	resourceContents: Content[] = new Array();
	//Pagination Params
    pages: number[];
    actualPage: number;
    pagesShow: string[];
    pageFirst: number;
	pageLast: number;
    pageRows: number;
    numEvents: number;
    searchValue: string = '';

    typesSelect: SelectItem[];
    selectedType: number;

    errorTitle: string;
    errorMessage: string;
    campusErrorTitle: string;
    campusErrorMessage: string;
    campusNoRows: boolean;
    campusNoRowsMessage: string;
    routerLinkCampusDetail: string;
    cursoIniciacionLink: string;

	constructor(private campusService: CampusService, private activatedRoute: ActivatedRoute, public sanitizer: DomSanitizer, private utilsService: UtilsService) {
        this.routerLinkCampusDetail = Constants.ROUTER_LINK_TOOLS_CAMPUS_CONTENT;
        this.pageRows = Constants.CAMPUS_EVENTS_PER_PAGE;
        this.campusErrorTitle = Constants.CAMPUS_EVENTS_ERROR_TITLE;
        this.campusErrorMessage = Constants.CAMPUS_EVENTS_ERROR_MESSAGE;
        this.cursoIniciacionLink = window["config"]["AOD_ASSETS_BASE_URL"] + Constants.CAMPUS_CURSO_INICIACION;
        this.campusNoRows = false;
        this.campusNoRowsMessage = Constants.CAMPUS_EVENTS_EMPTY;
        this.getOpenedMenu();
	 }

	ngOnInit() {
        
        this.activatedRoute.queryParams.subscribe(params => {
            try {
                if(params[Constants.ROUTER_LINK_DATA_CAMPUS_PARAM_TEXT] != undefined){
                    this.searchValue = params[Constants.ROUTER_LINK_DATA_CAMPUS_PARAM_TEXT];
                }
                if(params[Constants.ROUTER_LINK_DATA_CAMPUS_PARAM_TYPE] != undefined){
                    this.selectedType = +params[Constants.ROUTER_LINK_DATA_CAMPUS_PARAM_TYPE];
                }else{
                    this.selectedType = 0;
                }
                
            } catch (error) {
                console.error('Error: ngOnInit() queryParams - datasets-list.component.ts');
            }
        });

        
        this.getTypesDropdown();
        this.getCampusEvents(null, null);
	}

	getCampusEvents(page: number, rows: number){
        this.campusNoRows = false;
        this.eventsList = [];
        this.resourceContents = [];
		var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
		this.campusService.getCampusEvents(pageNumber, rowsNumber, this.selectedType, this.searchValue).subscribe(events => {
            try {
                this.eventsList = events;
                this.numEvents = events[0].total_count;
                this.setPagination(pageNumber, this.numEvents);
                this.getCampusContents();                
            } catch (error) {
                if (events[0] == null) {
                    this.setPagination(1, 1);
                    this.campusNoRows = true;
                } else {
                    console.error('Error: getCampusContents() - campus.component.ts');
                    this.errorTitle = this.campusErrorTitle;
                    this.errorMessage = this.campusErrorMessage;
                }
            }
        });
	}

	getCampusContents(){
        this.eventsList.forEach(event => {
            this.campusService.getCampusContents(event.id).subscribe(contents => {
                try {
                    event.contents = contents;
                } catch (error) {
                    console.error('Error: getCampusContents() - campus.component.ts');
                    this.errorTitle = this.campusErrorTitle;
                    this.errorMessage = this.campusErrorMessage;
                }
            });
        });
    }

    getCampusEventsBySearch(page: number, rows: number, searchParam: string): void {
        this.campusNoRows = false;
        this.eventsList = [];
        this.resourceContents = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.searchValue = searchParam;
        this.campusService.getCampusEvents(pageNumber, rowsNumber, this.selectedType, searchParam).subscribe(events => {
            try {
                this.eventsList = events;
                this.numEvents = events[0].total_count;
                this.campusNoRows = false;
                this.setPagination(pageNumber, this.numEvents);
                this.getCampusContents();   
            } catch (error) {
                if (events[0] == null) {
                    this.setPagination(1, 1);
                    this.campusNoRows = true;
                } else {
                    console.error('Error: getCampusContents() - campus.component.ts: ' + error);
                    this.errorTitle = this.campusErrorTitle;
                    this.errorMessage = this.campusErrorMessage;
                }
            }
        });
    }
    
    getTypesDropdown(){
        this.typesSelect = [];
        this.campusService.getCampusTypes().subscribe(types => {
            try {
                this.typesSelect = types;
                this.typesSelect.unshift({label: 'Todos los tipos', value: +0 })
            } catch (error) {
                console.error('Error: getTypesDropdown() - campus.component.ts');
                this.errorTitle = this.campusErrorTitle;
                this.errorMessage = this.campusErrorMessage;
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
        if (this.searchValue != '') {
            this.getCampusEventsBySearch(page, this.pageRows, this.searchValue);
        } else {
            this.getCampusEvents(page, this.pageRows);
        }   
        document.body.scrollTop = 0;
    }

    getOpenedMenu(){
        this.utilsService.openedMenuChange.subscribe(value => {
			this.openedMenu = value;
		});
    }
}
