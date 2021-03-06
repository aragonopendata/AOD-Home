import { Component, OnInit } from '@angular/core';
import { Constants } from '../../app.constants';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
declare var jQuery:any;
import { UtilsService } from '../../services/web/utils.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

	openedMenu: boolean;

	hovers: any[] = [];
	targetUrl: string;
	//Dynamic URL build parameters
	routerLinkPageNotFound: string;
	routerLinkDataCatalog: string;
	routerLinkDataTopics: string;
	routerLinkDataOrganizations: string;
	routerLinkServicesOpenDataPool: string;
	routerLinkServicesAragopedia: string;
	routerLinkServicesPresupuestos: string;
	routerLinkServicesCras: string;
	routerLinkServicesSocialData: string;
	routerLinkServicesAnalytics: string;
	routerLinkServicesFocus: string;
	routerLinkInfoOpenData: string;
	routerLinkInfoKnowledge: string;
	routerLinkInfoApplications: string;
	routerLinkInfoEventos: string;
	routerLinkInfoCollaboration: string;
	routerLinkToolsCampus: string;
	routerLinkToolsDevelopers: string;
	routerLinkToolsApis: string;
	routerLinkToolsGithub: string;
	routerLinkSparql: string;
	assetsUrl: string;

	constructor( private router: Router, private activatedRoute: ActivatedRoute,
		private location: Location, private utilsService: UtilsService ) { 
		//Dynamic URL build to send to HTML template
		this.routerLinkDataCatalog = Constants.ROUTER_LINK_DATA_CATALOG;
		this.routerLinkDataTopics = Constants.ROUTER_LINK_DATA_TOPICS;
		this.routerLinkDataOrganizations = Constants.ROUTER_LINK_DATA_ORGANIZATIONS;
		this.routerLinkServicesOpenDataPool = Constants.ROUTER_LINK_SERVICES_POOL;
		this.routerLinkServicesAragopedia = Constants.ROUTER_LINK_SERVICES_ARAGOPEDIA;
		this.routerLinkServicesPresupuestos = Constants.ROUTER_LINK_SERVICES_PRESUPUESTOS;
		this.routerLinkServicesCras = Constants.ROUTER_LINK_SERVICES_CRAS;
		this.routerLinkServicesSocialData = Constants.ROUTER_LINK_SERVICES_SOCIAL_DATA;
		this.routerLinkServicesAnalytics = Constants.ROUTER_LINK_SERVICES_ANALYTICS;
		this.routerLinkServicesFocus = Constants.ROUTER_LINK_SERVICES_FOCUS;
		this.routerLinkInfoOpenData = Constants.ROUTER_LINK_INFORMATION_OPEN_DATA;
		this.routerLinkInfoKnowledge = Constants.ROUTER_LINK_INFORMATION_CONOCIMIENTO;
		this.routerLinkInfoApplications = Constants.ROUTER_LINK_INFORMATION_APPS;
		this.routerLinkInfoEventos = Constants.ROUTER_LINK_INFORMATION_EVENTS;
		this.routerLinkInfoCollaboration = Constants.ROUTER_LINK_INFORMATION_COLLABORATION;
		this.routerLinkToolsCampus = Constants.ROUTER_LINK_TOOLS_CAMPUS;
		this.routerLinkToolsDevelopers = Constants.ROUTER_LINK_TOOLS_DEVELOPERS;
		this.routerLinkToolsApis = Constants.ROUTER_LINK_TOOLS_APIS;
		this.routerLinkToolsGithub = Constants.AOD_GITHUB_URL;
		this.routerLinkSparql = Constants.ROUTER_LINK_SPARQL;
		this.assetsUrl = window["config"]["AOD_ASSETS_BASE_URL"];
		this.getOpenedMenu();
		
	}

	ngOnInit() {
		this.getUrlFragment();
		this.hovers = [
			{ id: '#imgBD', hover: false },
			{ id: '#imgTem', hover: false },
			{ id: '#imgPub', hover: false },
			{ id: '#imgAragopedia', hover: false },
			{ id: '#imgPre', hover: false },
			{ id: '#imgOSD', hover: false },
			{ id: '#imgCRAs', hover: false },
			{ id: '#imgInfo', hover: false },
			{ id: '#imgApp', hover: false },
			{ id: '#imgEv', hover: false },
			{ id: '#imgCol', hover: false },
			{ id: '#imgCampus', hover: false },
			{ id: '#imgDesa', hover: false },
			{ id: '#imgAPIs', hover: false },
			{ id: '#imgSPARQL', hover: false },
			{ id: '#imgGit', hover: false },
			{ id: '#imgAna', hover: false },
			{ id: '#imgVis', hover: false },
			{ id: '#imgPool', hover: false},
			{ id: '#imgCono', hover: false }
		];
	}

	move(id) {
		jQuery('html, body').animate({ scrollTop: (jQuery('.' + id).offset().top - jQuery('#header').height()) }, '1000');
	}

	hover(id, src) {
		for (let hover of this.hovers) {
			if (hover.id === id) {
				hover.hover = !hover.hover;
			}
		}
		jQuery(id).fadeOut(350, function () {
			jQuery(id).attr('src', src);
			jQuery(id).fadeIn(350);
		});
	}

	unhover(id, src) {
		for (let hover of this.hovers) {
			if (hover.id === id) {
				hover.hover = !hover.hover;
			}
		}
		jQuery(id).fadeOut(350, function () {
			jQuery(id).attr('src', src);
			jQuery(id).fadeIn(350);
		});
	}

	goToUrl(url: string) {
		let fullUrl = '';
		if (url && url != undefined && url != '') {
			if (this.routerLinkServicesAragopedia === url) {
				fullUrl += window["config"]["AOD_BASE_URL"] + '/' + url;
				window.location.href = fullUrl;
			} else if (this.routerLinkServicesPresupuestos === url) {
				fullUrl += window["config"]["PRESUPUESTOS_BASE_URL"];
				window.location.href = fullUrl;
			} else if (this.routerLinkServicesSocialData === url) {
				fullUrl += window["config"]["AOD_BASE_URL"] + '/' + url;
				window.location.href = fullUrl;
			} else if (this.routerLinkServicesCras === url) {
				fullUrl += window["config"]["AOD_BASE_URL"] + '/' + url;
				window.location.href = fullUrl;
			} else if (this.routerLinkToolsGithub === url) {
				window.location.href = url;
			} else {
				fullUrl += window["config"]["AOD_BASE_URL"] + '/' + Constants.ROUTER_LINK_404;
				window.location.href = url;
			}
		} else {
			return false;
		}
	}

	getUrlFragment() {
        this.activatedRoute.fragment.subscribe(fragment => {
			switch(fragment){
				//OPEN-DATA
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_OPEN_DATA:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_REUTILIZATION:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_GOOD_PRACTICES:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_LEGAL:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_EXPERIENCIES:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_ARAGON_OPEN_DATA:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_OBJECTIVES:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_PARTICIPATION:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_ARAGON_SERVICES:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_DOCUMENTATION:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_TERMS:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_CONDITIONS:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT+fragment);
				break;
				//CONOCIMIENTO
				case Constants.STATIC_INFO_CONOCIMIENTO_SECTION_EI2A:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_CONOCIMIENTO_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_CONOCIMIENTO_SECTION_ONTOLOGY:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_CONOCIMIENTO_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_CONOCIMIENTO_SECTION_GRAFO:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_CONOCIMIENTO_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_CONOCIMIENTO_SECTION_CONSULTA:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_CONOCIMIENTO_SECTION_REDIRECT+fragment);
				break;
				//EVENTS
				case Constants.STATIC_INFO_EVENTS_SECTION_JACATHON:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_EVENTS_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_EVENTS_SECTION_PRESTACION_SERVICIOS_MUNDO_DIGITAL:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_EVENTS_SECTION_REDIRECT+fragment);
				break;
				//DEVELOPERS
				case Constants.STATIC_INFO_DEVELOPERS_SECTION_INTEROPERABILITY:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_DEVELOPERS_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_DEVELOPERS_SECTION_TECHNOLOGY:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_DEVELOPERS_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_DEVELOPERS_SECTION_DIRECT_DOWNLOAD:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_DEVELOPERS_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_DEVELOPERS_SECTION_METADATES:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_DEVELOPERS_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_DEVELOPERS_SECTION_TOOLS:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_DEVELOPERS_SECTION_REDIRECT+fragment);
				break;
				//APIS
				case Constants.STATIC_INFO_APIS_SECTION_CKAN:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_APIS_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_APIS_SECTION_SOCIAL_DATA:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_APIS_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_APIS_SECTION_ARAGOPEDIA:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_APIS_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_APIS_SECTION_ARAGODBPEDIA_1:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_APIS_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_APIS_SECTION_ARAGODBPEDIA_2:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_APIS_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_APIS_SECTION_GA_OD_CORE:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_APIS_SECTION_REDIRECT+fragment);
				break;
				case Constants.STATIC_INFO_APIS_SECTION_GRAFO_CONOCIMIENTO:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_APIS_SECTION_REDIRECT+fragment);
				break;
				default:
					this.location.go('/');
				break;
			}
		});
	}

    getOpenedMenu(){
        this.utilsService.openedMenuChange.subscribe(value => {
			this.openedMenu = value;
		});
    }

    toggleOpenedMenu() {
        this.utilsService.tooggleOpenedMenu();
    }
}
