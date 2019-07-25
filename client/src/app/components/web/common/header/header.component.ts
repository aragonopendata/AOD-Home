import * as $ from 'jquery';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../../app.component';
import { Constants } from '../../../../app.constants';
import { Dataset } from 'app/models/Dataset';
import { Observable ,  Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Autocomplete } from 'app/models/Autocomplete';
import { Router, ActivatedRoute } from '@angular/router';
import { DatasetsService } from 'app/services/web/datasets.service';
import { DatasetsDetailComponent } from '../../datasets/datasets-detail/datasets-detail.component';
import { UtilsService } from '../../../../services/web/utils.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    
    openedMenu: boolean = false;
    menuActive: boolean = false;
    srcMenu: string;
    srcLogin: string;
    dataset: Dataset;
	datasetAutocomplete: Autocomplete[];
	private datasetTitle = new Subject<string>();
    private resultsLimit: number;
    //Dynamic URL build parameters
    routerLinkLogin: string;
	routerLinkPageNotFound: string;
    routerLinkDataCatalog: string;
    routerLinkDataCatalogDataset: string;
	routerLinkDataTopics: string;
	routerLinkDataOrganizations: string;
	routerLinkServicesOpenDataPool: string;
	routerLinkServicesAragopedia: string;
	routerLinkServicesPresupuestos: string;
	routerLinkServicesCras: string;
    routerLinkServicesSocialData: string;
    routerLinkServicesAnalytics: string;
    routerLinkServicesVisualData: string;
	routerLinkInfoOpenData: string;
	routerLinkInfoKnowledge: string;
	routerLinkInfoApplications: string;
	routerLinkInfoEventos: string;
	routerLinkInfoCollaboration: string;
	routerLinkToolsCampus: string;
	routerLinkToolsDevelopers: string;
	routerLinkToolsApis: string;
	routerLinkToolsGithub: string;
    aodBaseUrl: string;
    presupuestosBaseUrl: string;
    transparenciaWebUrl: string;
    aragonParticipaWebUrl: string;
    routerLinkSparql: string;
    assetsUrl: string;

    constructor(private locale: AppComponent, private constants: Constants,
            private datasetService: DatasetsService, private router: Router,
            private route: ActivatedRoute, private utilsService: UtilsService) { 
        this.aodBaseUrl = Constants.AOD_BASE_URL;
        this.presupuestosBaseUrl = Constants.PRESUPUESTOS_BASE_URL;
        this.transparenciaWebUrl = Constants.TRANSPARENCIA_WEB_URL;
        this.aragonParticipaWebUrl = Constants.ARAGON_PARTICIPA_WEB_URL;
        this.resultsLimit = Constants.DATASET_AUTOCOMPLETE_HEADER_LIMIT_RESULTS;
        this.routerLinkLogin = Constants.ROUTER_LINK_LOGIN;
        this.routerLinkDataCatalog = Constants.ROUTER_LINK_DATA_CATALOG;
        this.routerLinkDataCatalogDataset = Constants.ROUTER_LINK_DATA_CATALOG_DATASET;
		this.routerLinkDataTopics = Constants.ROUTER_LINK_DATA_TOPICS;
		this.routerLinkDataOrganizations = Constants.ROUTER_LINK_DATA_ORGANIZATIONS;
		this.routerLinkServicesOpenDataPool = Constants.ROUTER_LINK_SERVICES_POOL;
		this.routerLinkServicesAragopedia = Constants.ROUTER_LINK_SERVICES_ARAGOPEDIA;
		this.routerLinkServicesCras = Constants.ROUTER_LINK_SERVICES_CRAS;
        this.routerLinkServicesSocialData = Constants.ROUTER_LINK_SERVICES_SOCIAL_DATA;
        this.routerLinkServicesAnalytics = Constants.ROUTER_LINK_SERVICES_ANALYTICS;
        this.routerLinkServicesVisualData = Constants.ROUTER_LINK_SERVICES_VISUAL_DATA;
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
        this.assetsUrl = Constants.AOD_ASSETS_BASE_URL;

        this.srcMenu = this.assetsUrl + '/public/header/images/Boton-Menu-Responsive-OFF.png';
        this.srcLogin = this.assetsUrl + '/public/header/images/Boton-Acceso-Usuarios-OFF.png';
    }

    openNav() {
        this.toggleOpenedMenu();
        this.openedMenu = this.getOpenedMenu();
        if (!this.menuActive) {
            $('#menu').attr('alt', 'cerrar-menú');
            $('.overlay').css('top', $('#header').height());
            $('#myNav').height($(window).height() - $('#header').height());
            $('#logo').attr('src', this.assetsUrl + '/public/header/images/AOD-Logo-Responsive.png');
            this.menuActive = !this.menuActive;
            $('#nav').attr('class', 'navbar navbar-toggleable-md bg-inverse');
            $('#nav').css('background-color', 'rgba(0,0,0, 0.82)');
            this.srcLogin = this.assetsUrl + '/public/header/images/Boton-Acceso-Usuarios-gris.png';
            this.srcMenu = this.assetsUrl + '/public/header/images/Boton-Salir-Menu-Responsive-OFF.png';
        } else {
            $('#menu').attr('alt', 'desplegar-menú');
            $('body,html').css('overflow-y', 'auto');
            $('#myNav').height('0%');
            $('#nav').attr('class', 'navbar navbar-toggleable-md bg-light');
            $('#logo').attr('src', this.assetsUrl + '/public/header/images/AOD-Logo.png');
            $('#searchBox').val('');
            this.menuActive = !this.menuActive;
            this.srcLogin = this.assetsUrl + '/public/header/images/Boton-Acceso-Usuarios-OFF.png';
            this.srcMenu = this.assetsUrl + '/public/header/images/Boton-Menu-Responsive-OFF.png';
            this.datasetAutocomplete = [];
        }
    }

    hover(id) {
        if (this.menuActive) {
            if (id === '#login') {
                this.srcLogin = this.assetsUrl + '/public/header/images/Boton-Acceso-Usuarios-blanco.png';
            } else if (id === '#menu') {
                this.srcMenu = this.assetsUrl + '/public/header/images/Boton-Salir-Menu-Responsive-ON.png';
            }
        } else {
            if (id === '#login') {
                this.srcLogin = this.assetsUrl + '/public/header/images/Boton-Acceso-Usuarios-ON.png';
            } else if (id === '#menu') {
                this.srcMenu = this.assetsUrl + '/public/header/images/Boton-Menu-Responsive-ON.jpg';
            }
        }
    }

    unhover(id) {
        if (this.menuActive) {
            if (id === '#login') {
                this.srcLogin = this.assetsUrl + '/public/header/images/Boton-Acceso-Usuarios-gris.png';
            } else if (id === '#menu') {
                this.srcMenu = this.assetsUrl + '/public/header/images/Boton-Salir-Menu-Responsive-OFF.png';
            }
        } else {
            if (id === '#login') {
                this.srcLogin = this.assetsUrl + '/public/header/images/Boton-Acceso-Usuarios-OFF.png';
            } else if (id === '#menu') {
                this.srcMenu = this.assetsUrl + '/public/header/images/Boton-Menu-Responsive-OFF.png';
            }
        }
    }

    search(title: string): void {
		//Lectura cuando hay al menos 3 caracteres, (3 espacios produce error).
		if (title.length >= Constants.DATASET_AUTOCOMPLETE_MIN_CHARS) {
			this.datasetTitle.next(title);
		} else {
			this.datasetAutocomplete = null;
		}
	}

	getAutocomplete(): void {
		//Funciona la busqueda, falla al poner un caracter especial
		this.datasetTitle
			.debounceTime(Constants.DATASET_AUTOCOMPLETE_DEBOUNCE_TIME)
			.distinctUntilChanged()
			.switchMap(title => title
				? this.datasetService.getDatasetsAutocomplete(title, this.resultsLimit)
				: Observable.of<Autocomplete[]>([]))
			.catch(error => {
				console.error(error);
				return Observable.of<Autocomplete[]>([]);
			}).subscribe(data =>
				this.datasetAutocomplete = JSON.parse(data).result);
	}

    focusUserName(){
        document.getElementById('loginLink').blur();
    }

    searchDatasetsByText(text: string){
		this.router.navigate(['/' + this.routerLinkDataCatalog], { queryParams: { texto: text} });
    }
    
    onResize(event) {
        $('.overlay').css('top', $('#header').height());
        if(this.menuActive==true){
            $('#myNav').height($(window).height() - $('#header').height());
        }
    }

    navigate(name: string) {
        DatasetsDetailComponent.doUpdate.next(name);
        this.router.navigate(['/'+this.routerLinkDataCatalogDataset, name]);
    }

    ngOnInit() {
        this.getAutocomplete();
    }

    getOpenedMenu(): boolean{
        return this.utilsService.openedMenu;
    }

    toggleOpenedMenu() {
        this.utilsService.tooggleOpenedMenu();
    }

}
