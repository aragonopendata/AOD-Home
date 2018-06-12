import { Component, OnInit, AfterViewChecked, ViewEncapsulation  } from '@angular/core';
import { AccordionModule } from 'primeng/primeng';
import { StaticContent } from '../../../../../models/StaticContent';
import { StaticContentService } from '../../../../../services/web/static-content.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from "app/app.constants";
import { UtilsService } from '../../../../../services/web/utils.service';
declare var jQuery:any;

@Component({
    selector: 'app-developers',
    templateUrl: './developers.component.html',
    styleUrls: ['./developers.component.css']
})
export class DevelopersComponent implements OnInit, AfterViewChecked {
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
    developersErrorTitle: string;
    developersErrorMessage: string;

    constructor(private staticContentService: StaticContentService,
        private activatedRoute: ActivatedRoute,
        private utilsService: UtilsService) {
            this.getOpenedMenu();
        }

    ngOnInit() {
        this.developersErrorTitle = Constants.DEVELOPERS_STATIC_CONTENT_ERROR_TITLE;
        this.developersErrorMessage = Constants.DEVELOPERS_STATIC_CONTENT_ERROR_MESSAGE;
        this.getStaticContentInfo();
    }

    getUrlFragment() {
        this.activatedRoute.fragment.subscribe(fragment => {
            this.targetUrl = fragment;
		});
    }

    getStaticContentInfo() {
        this.staticContentService.getDevelopersToolsStaticContent().subscribe(staticContent => {
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
                this.errorTitle = this.developersErrorTitle;
                this.errorMessage = this.developersErrorMessage;
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
            jQuery("html, body").animate({ scrollTop: jQuery(element).offset().top - (jQuery('#header').height()+15)}, '500');
            document.getElementById(this.url+'Link').setAttribute('aria-expanded','true');
            document.getElementById(this.url+'Link').setAttribute('class','headLink');
            document.getElementById(this.url).setAttribute('class','collapse show');
        }
    }

    getOpenedMenu(){
        this.utilsService.openedMenuChange.subscribe(value => {
            this.openedMenu = value;
        });
    }
}
