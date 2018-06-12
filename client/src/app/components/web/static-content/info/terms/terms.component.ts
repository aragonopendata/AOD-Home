import { Component, OnInit, AfterViewChecked, ViewEncapsulation  } from '@angular/core';
import { StaticContent } from '../../../../../models/StaticContent';
import { StaticContentService } from '../../../../../services/web/static-content.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from "app/app.constants";
import { UtilsService } from '../../../../../services/web/utils.service';
declare var jQuery:any;

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit, AfterViewChecked {
  index: number = 0;
  openedMenu: boolean;
  
  content: StaticContent;
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
      this.getStaticContentTerms();
  }


  getStaticContentTerms() {
      this.staticContentService.getOpenDataInfoTermsStaticContent().subscribe(staticContent => {
          try {
              this.content = staticContent[0];
              this.sectionTitle = this.content.sectionTitle;
              this.sectionSubtitle = this.content.sectionSubtitle;
              this.sectionDescription = this.content.sectionDescription;
          } catch (error) {
              console.error('Error: getStaticContentTerms() - open-data.component.ts');
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
          this.openedMenu = value;
      });
  }
}

