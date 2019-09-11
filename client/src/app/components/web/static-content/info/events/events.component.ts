import { Component, OnInit, AfterViewChecked, NgZone } from '@angular/core';
import { StaticContent } from '../../../../../models/StaticContent';
import { StaticContentService } from '../../../../../services/web/static-content.service';
import { ActivatedRoute } from '@angular/router';
import { Constants } from "app/app.constants";
import { UtilsService } from '../../../../../services/web/utils.service';
import StaticContentUtils from '../../../../../utils/StaticContentUtils';
import { Http, Headers } from '@angular/http';
declare var jQuery:any;

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

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
    eventsErrorTitle: string;
    eventsErrorMessage: string;

    constructor(private staticContentService: StaticContentService,
        private activatedRoute: ActivatedRoute,
        private utilsService: UtilsService,
        private http: Http,
        private zone:NgZone) {

        this.getOpenedMenu();

        window['angularComponentReference'] = {
            zone: this.zone,
            componentFn: (value) => this.provisionServicesRegistration(value),
            component: this,
        };

    }

    ngOnInit() {
        this.eventsErrorTitle = Constants.EVENTS_STATIC_CONTENT_ERROR_TITLE;
        this.eventsErrorMessage = Constants.EVENTS_STATIC_CONTENT_ERROR_MESSAGE;
        this.getStaticContentInfo();
    }

    getUrlFragment() {
        this.activatedRoute.fragment.subscribe(fragment => {
            this.targetUrl = fragment;
		});
    }

    getStaticContentInfo() {
        this.staticContentService.getEventsInfoStaticContent().subscribe(staticContent => {
            try {
                this.contents = staticContent;
                this.sectionTitle = this.contents[0].sectionTitle;
                this.sectionSubtitle = this.contents[0].sectionSubtitle;
                this.sectionDescription = this.contents[0].sectionDescription;
                this.getUrlFragment();
            } catch (error) {
                console.error('Error: getStaticContentInfo() - events.component.ts');
                this.errorTitle = this.eventsErrorTitle;
                this.errorMessage = this.eventsErrorMessage;
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

    public provisionServicesRegistration(value){
        var headers = new Headers();
        headers.append('Content-Type', ' application/json');
        let fullURL = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_REGISTRATION_EVENT_PRESTACION_PUBLI;
        this.http.post(fullURL, JSON.stringify(value), { headers: headers }).subscribe(result => {
            if(result.json().status == 200){
                jQuery('#success').show();
                jQuery('#registrationForm')[0].reset();
                jQuery('#success').html('Bienvenido a #tudigitalhub - Pronto recibirá confirmación.');
            }else if(result.json().status != 200){
                jQuery('#error').show();
                jQuery('#error').html('No se ha podido realizar el registro. Vuelva a intentarlo más tarde.');
            }
        });
    }
    
}
