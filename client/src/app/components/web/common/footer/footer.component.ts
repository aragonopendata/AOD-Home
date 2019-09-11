import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../../app.constants';
import { UtilsService } from '../../../../services/web/utils.service';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

	openedMenu: boolean;

	aodBaseUrl: String
	//Dynamic URL build parameters
	routerLinkInfoOpenData: string;
	routerLinkInfoTerms: string;
	routerLinkDataCatalog: string;
	routerLinkServicesOpenDataPool: string;
	routerLinkServicesAragopedia: string;
	routerLinkServicesSocialData: string;
	routerLinkInfoCollaboration: string;
	routerLinkInfoApplications: string;
	routerLinkInfoKnowledge: string;
	
	ckanUrl: string;
	mediaWikiUrl: string;
	virtuosoUrl: string;
	eldaUrl: string;
	swaggerUrl: string;
	nodeJsUrl: string;
	angularUrl: string;
	kibanaUrl: string;
	oasiFacebookUrl: string;
	oasiTwitterUrl: string;
	oasiYoutubeUrl: string;
	aodMail: string;
	assetsUrl: string;

	constructor(private constants: Constants, private utilsService: UtilsService) { 
		this.aodBaseUrl = window["config"]["AOD_BASE_URL"];
		this.routerLinkInfoOpenData = Constants.ROUTER_LINK_INFORMATION_OPEN_DATA;
		this.routerLinkDataCatalog = Constants.ROUTER_LINK_DATA_CATALOG;
		this.routerLinkServicesOpenDataPool = Constants.ROUTER_LINK_SERVICES_POOL;
		this.routerLinkServicesAragopedia = Constants.ROUTER_LINK_SERVICES_ARAGOPEDIA;
		this.routerLinkServicesSocialData = Constants.ROUTER_LINK_SERVICES_SOCIAL_DATA;
		this.routerLinkInfoCollaboration = Constants.ROUTER_LINK_INFORMATION_COLLABORATION;
		this.routerLinkInfoApplications = Constants.ROUTER_LINK_INFORMATION_APPS;
		this.routerLinkInfoTerms = Constants.ROUTER_LINK_INFORMATION_TERMS;
		this.routerLinkInfoKnowledge = Constants.ROUTER_LINK_INFORMATION_CONOCIMIENTO;
		this.ckanUrl = Constants.CKAN_URL;
		this.mediaWikiUrl = Constants.MEDIA_WIKI_URL;
		this.virtuosoUrl = Constants.VIRTUOSO_URL;
		this.eldaUrl = Constants.ELDA_URL;
		this.swaggerUrl = Constants.SWAGGER_URL;
		this.nodeJsUrl = Constants.NODE_JS_URL;
		this.angularUrl = Constants.ANGULAR_URL;
		this.kibanaUrl = Constants.KIBANAFOOTER_URL;
		this.oasiFacebookUrl = Constants.OASI_FACEBOOK_URL;
		this.oasiTwitterUrl = Constants.OASI_TWITTER_URL;
		this.oasiYoutubeUrl = Constants.OASI_YOUTUBE_URL;
		this.aodMail = Constants.AOD_MAIL;
		this.assetsUrl = window["config"]["AOD_ASSETS_BASE_URL"];

		this.getOpenedMenu();
	}

	ngOnInit() {
	}

    getOpenedMenu(){
        this.utilsService.openedMenuChange.subscribe(value => {
			this.openedMenu = value;
		});
    }

}
