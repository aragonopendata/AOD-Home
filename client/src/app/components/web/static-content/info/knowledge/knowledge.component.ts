import { Component, OnInit } from '@angular/core';
import { StaticContent } from '../../../../../models/StaticContent';
import { StaticContentService } from '../../../../../services/web/static-content.service';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../../../services/web/utils.service';
import { Constants } from '../../../../../app.constants';
import StaticContentUtils from '../../../../../utils/StaticContentUtils';
declare var jQuery:any;

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.css']
})
export class KnowledgeComponent implements OnInit {

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
    openDataErrorTitle: string;
    openDataErrorMessage: string;

    constructor(private staticContentService: StaticContentService,
        private activatedRoute: ActivatedRoute,
        private utilsService: UtilsService) {
            this.getOpenedMenu();
        }

    ngOnInit() {
        this.openDataErrorTitle = Constants.OPEN_DATA_STATIC_CONTENT_ERROR_TITLE;
        this.openDataErrorMessage = Constants.OPEN_DATA_STATIC_CONTENT_ERROR_MESSAGE;
        this.getStaticContentInfo();
    }

    getUrlFragment() {
        this.activatedRoute.fragment.subscribe(fragment => {
            this.targetUrl = fragment;
		});
    }

    getStaticContentInfo() {
        this.staticContentService.getOpenDataInfoKnowledgeStaticContent().subscribe(staticContent => {
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
                console.error('Error: getStaticContentInfo() - open-data.component.ts');
                this.errorTitle = this.openDataErrorTitle;
                this.errorMessage = this.openDataErrorMessage;
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
			let staticContentUtils = new StaticContentUtils();
			staticContentUtils.setAccessibility(this.contents, this.openedMenu);
			this.openedMenu = value;
		});
    }

}
