import { Component, OnInit, AfterViewChecked, ViewEncapsulation  } from '@angular/core';
import { StaticContent } from '../../../../../models/StaticContent';
import { StaticContentService } from '../../../../../services/web/static-content.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from "app/app.constants";
import { UtilsService } from '../../../../../services/web/utils.service';
import StaticContentUtils from '../../../../../utils/StaticContentUtils';
declare var jQuery:any;

@Component({
    selector: 'app-sparql',
    templateUrl: './sparql.component.html',
    styleUrls: ['./sparql.component.css']
})
export class SparqlComponent implements OnInit {
    openedMenu: boolean;
    index: number = 0;
    contents: StaticContent[];
    sectionTitle: string;
    sectionSubtitle: string;
    sectionDescription: string;
    targetUrl: string;
    url: string = null;

    errorTitle: string;
    errorMessage: string;
    sparqlErrorTitle: string;
    sparqlErrorMessage: string;

    constructor(private staticContentService: StaticContentService,
        private activatedRoute: ActivatedRoute,
        private utilsService: UtilsService) {
            this.getOpenedMenu();
        }

    ngOnInit() {
        this.sparqlErrorTitle = Constants.SPARQL_STATIC_CONTENT_ERROR_TITLE;
        this.sparqlErrorMessage = Constants.SPARQL_STATIC_CONTENT_ERROR_MESSAGE;
        this.getStaticContentInfo();
    }

    getUrlFragment() {
        this.activatedRoute.fragment.subscribe(fragment => {
            this.targetUrl = fragment;
		});
    }

    getStaticContentInfo() {
        this.staticContentService.getSparqlToolsStaticContent().subscribe(staticContent => {
            try {
                this.contents = staticContent;
                this.sectionTitle = this.contents[0].sectionTitle;
                this.sectionSubtitle = this.contents[0].sectionSubtitle;
                this.sectionDescription = this.contents[0].sectionDescription;
                this.getUrlFragment();
                if (this.targetUrl && this.targetUrl != null && this.targetUrl != '') {
                    this.contents.forEach(content => {
                        if (this.targetUrl === content.targetUrl) {
                            this.index = (content.contentOrder - 1);
                        }
                    });
                }
            } catch (error) {
                console.error('Error: getStaticContentInfo() - developers.component.ts');
                this.errorTitle = this.sparqlErrorTitle;
                this.errorMessage = this.sparqlErrorMessage;
            }
        });
    }

    ngAfterViewChecked() {
        this.openSection();
    }

    openSection(){
        if(this.targetUrl != this.url && this.targetUrl != null){
            this.url = this.targetUrl;
            var element = document.getElementById(this.url+'Link');
            jQuery("html, body").animate({ scrollTop: jQuery(element).offset().top - (jQuery('#header').height()+20)}, '500');
            document.getElementById(this.url+'Link').setAttribute('aria-expanded','true');
            document.getElementById(this.url+'Link').setAttribute('class','headLink');
            document.getElementById(this.url).setAttribute('class','collapse show');
        }
    }

    getOpenedMenu(){
        this.utilsService.openedMenuChange.subscribe(value => {
			let staticContentUtils = new StaticContentUtils();
			staticContentUtils.setAccessibility(this.contents, this.openedMenu);
			this.openedMenu = value;
		});
    }
}
