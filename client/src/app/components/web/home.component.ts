import { Component, OnInit } from '@angular/core';
import { Constants } from '../../app.constants';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
declare var jQuery: any;
import { UtilsService } from '../../services/web/utils.service';
import { Topic } from 'app/models/Topic';
import { TopicsService } from 'app/services/web/topics.service';
import { DatasetsService } from '../../services/web/datasets.service';
import { Dataset } from 'app/models/Dataset';
import { SelectItem } from 'app/models/SelectItem';
import { ChartService } from 'app/services/web/chart.service';

import { GlobalUtils } from '../../utils/GlobalUtils';

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
	routerLinkServicesVisual: string;
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
	topics: Topic[];
	topic: Topic;
	newestDatasets: Dataset[];
	downloadedDatasets: Dataset[];
	datasetCount: SelectItem[];
	resourceCount: SelectItem[];
	routerLinkDataCatalogDataset: string;

	errorTitle: string;
	errorMessage: string;
	datasetListErrorTitle: string;
	datasetListErrorMessage: string;

	chartsData: Array<any> = [];
	totalDatasetsOfOrg: Array<any> = [];

	constructor(private datasetsService: DatasetsService, private router: Router, private activatedRoute: ActivatedRoute,
		private location: Location, private utilsService: UtilsService, private topicsService: TopicsService, private chartService: ChartService) {
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
		this.routerLinkServicesVisual = Constants.ROUTER_LINK_SERVICES_VISUAL_DATA;
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
		this.routerLinkDataCatalogDataset = Constants.ROUTER_LINK_DATA_CATALOG_DATASET;
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
			{ id: '#imgPool', hover: false },
			{ id: '#imgCono', hover: false }
		];
		this.getTopics();
		this.setInfoTables();
		this.setDatasetsStats();
		this.loadCharts();
		this.getTotalDatasetsOfOrg();
	}

	loadCharts() {
		let pagination = 0;
		let n_charts = 999999;
		let totalCharts = 0;
		let randomChart = 0;
		let maxChartsToLoad = 2;

		this.chartService
			.getCharts(pagination, n_charts)
			.subscribe(data => {
				//Se saca el total de graficas para luego obtener un numero aleatorio en base al máximo de gráficas
				totalCharts = data.charts.length;
				for (let i = 0; i < maxChartsToLoad; i++) {
					randomChart = GlobalUtils.generateRandomNumberByRange(0, totalCharts);
					this.chartsData[i] = {
						url: Constants.AOD_BASE_URL + Constants.GET_HOME_EMBED_CHART_URL + data.charts[randomChart].id,
						title: data.charts[randomChart].title,
						id: data.charts[randomChart].id
					};
					
				}
			});
	}

	openChart(id) {
		window.location.href = Constants.AOD_BASE_URL + '/servicios/visualdata/charts/' + id;
	}

	getTotalDatasetsOfOrg() {
		let pageNumber = 0;
		let rowsNumber = 20;
		let sort = 'relevance, -metadata_modified';
		let orgName = 'instituto-aragones-estadistica';
		this.datasetsService.getDatasetsByOrganization(orgName, sort, pageNumber, rowsNumber, null).subscribe(datasets => {
			try {
				this.totalDatasetsOfOrg.push({
					orgName: 'Datasets Estadísticos',
					url: Constants.AOD_BASE_URL + '/' + Constants.ROUTER_LINK_DATA_CATALOG_SEARCH + '/' + orgName,
					count: JSON.parse(datasets).result.count
				});
			} catch (error) {
				console.error("Error: getDatasets() - organizations-detail.component.ts");
				console.error("Error ---> " + error);
				this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
			}
		});
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
				fullUrl += Constants.AOD_BASE_URL + '/' + url;
				window.location.href = fullUrl;
			} else if (this.routerLinkServicesPresupuestos === url) {
				fullUrl += Constants.PRESUPUESTOS_BASE_URL;
				window.location.href = fullUrl;
			} else if (this.routerLinkServicesSocialData === url) {
				fullUrl += Constants.AOD_BASE_URL + '/' + url;
				window.location.href = fullUrl;
			} else if (this.routerLinkServicesCras === url) {
				fullUrl += Constants.AOD_BASE_URL + '/' + url;
				window.location.href = fullUrl;
			} else if (this.routerLinkToolsGithub === url) {
				window.location.href = url;
			} else {
				fullUrl += Constants.AOD_BASE_URL + '/' + Constants.ROUTER_LINK_404;
				window.location.href = url;
			}
		} else {
			return false;
		}
	}

	getUrlFragment() {
		this.activatedRoute.fragment.subscribe(fragment => {
			switch (fragment) {
				//OPEN-DATA
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_OPEN_DATA:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_REUTILIZATION:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_GOOD_PRACTICES:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_LEGAL:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_EXPERIENCIES:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_ARAGON_OPEN_DATA:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_OBJECTIVES:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_PARTICIPATION:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_ARAGON_SERVICES:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_DOCUMENTATION:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_TERMS:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_OPEN_DATA_SECTION_CONDITIONS:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_OPEN_DATA_SECTION_REDIRECT + fragment);
					break;
				//CONOCIMIENTO
				case Constants.STATIC_INFO_CONOCIMIENTO_SECTION_EI2A:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_CONOCIMIENTO_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_CONOCIMIENTO_SECTION_ONTOLOGY:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_CONOCIMIENTO_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_CONOCIMIENTO_SECTION_GRAFO:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_CONOCIMIENTO_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_CONOCIMIENTO_SECTION_CONSULTA:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_CONOCIMIENTO_SECTION_REDIRECT + fragment);
					break;
				//EVENTS
				case Constants.STATIC_INFO_EVENTS_SECTION_JACATHON:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_EVENTS_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_EVENTS_SECTION_PRESTACION_SERVICIOS_MUNDO_DIGITAL:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_EVENTS_SECTION_REDIRECT + fragment);
					break;
				//DEVELOPERS
				case Constants.STATIC_INFO_DEVELOPERS_SECTION_INTEROPERABILITY:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_DEVELOPERS_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_DEVELOPERS_SECTION_TECHNOLOGY:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_DEVELOPERS_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_DEVELOPERS_SECTION_DIRECT_DOWNLOAD:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_DEVELOPERS_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_DEVELOPERS_SECTION_METADATES:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_DEVELOPERS_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_DEVELOPERS_SECTION_TOOLS:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_DEVELOPERS_SECTION_REDIRECT + fragment);
					break;
				//APIS
				case Constants.STATIC_INFO_APIS_SECTION_CKAN:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_APIS_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_APIS_SECTION_SOCIAL_DATA:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_APIS_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_APIS_SECTION_ARAGOPEDIA:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_APIS_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_APIS_SECTION_ARAGODBPEDIA_1:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_APIS_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_APIS_SECTION_ARAGODBPEDIA_2:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_APIS_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_APIS_SECTION_GA_OD_CORE:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_APIS_SECTION_REDIRECT + fragment);
					break;
				case Constants.STATIC_INFO_APIS_SECTION_GRAFO_CONOCIMIENTO:
					this.router.navigateByUrl(Constants.ROUTER_LINK_STATIC_CONTENT_APIS_SECTION_REDIRECT + fragment);
					break;
				default:
					this.location.go('/');
					break;
			}
		});
	}

	getOpenedMenu() {
		this.utilsService.openedMenuChange.subscribe(value => {
			this.openedMenu = value;
		});
	}

	toggleOpenedMenu() {
		this.utilsService.tooggleOpenedMenu();
	}

	setHovers() {
		for (let top of this.topics) {
			this.hovers.push({ label: top.title, hover: false });
		}
	}

	getTopics(): void {
		this.topicsService.getTopics().subscribe(topics => {
			try {
				this.topics = JSON.parse(topics).result;
				this.setHovers();
			} catch (error) {
				console.error("Error: getTopics() - topics-list.component.ts");
				this.errorTitle = "Se ha producido un error";
				this.errorMessage = "Se ha producido un error en la carga de Temas, vuelva a intentarlo y si el error persiste contacte con el administrador.";
			}
		});
	}

	setTopic(topic) {
		this.topicsService.setTopic(topic);
	}

	setHover(name, index) {
		for (let hover of this.hovers) {
			if (hover.label === name) {
				hover.hover = !hover.hover;
			}
		}
	}

	unsetHover(name, index) {
		for (let hover of this.hovers) {
			if (hover.label === name) {
				hover.hover = !hover.hover;
			}
		}
	}

	navigate(topicName) {
		this.router.navigateByUrl('/' + this.routerLinkDataTopics + '/' + topicName);
	}

	setInfoTables() {
		this.datasetsService.getNewestDataset().subscribe(datasets => {
			try {
				this.newestDatasets = JSON.parse(datasets).result.results;
			} catch (error) {
				console.error('Error: setInfoTables() - datasets-list.component.ts');
				this.errorTitle = this.datasetListErrorTitle;
				this.errorMessage = this.datasetListErrorMessage;
			}
		});
		this.datasetsService.getDownloadedDataset().subscribe(datasets => {
			try {
				this.downloadedDatasets = JSON.parse(datasets).result.results;
			} catch (error) {
				console.error('Error: setInfoTables() - datasets-list.component.ts');
				this.errorTitle = this.datasetListErrorTitle;
				this.errorMessage = this.datasetListErrorMessage;
			}
		});
	}
	setDatasetsStats() {
		this.datasetsService.getDatasetsNumber().subscribe(datasets => {
			try {
				this.datasetCount = [];
				let totalNumDatasets = '';
				totalNumDatasets = JSON.parse(datasets).result.count + '';
				while (totalNumDatasets.length < 8) totalNumDatasets = 'S' + totalNumDatasets;
				for (var i = 0; i < totalNumDatasets.length; i++) {
					if (totalNumDatasets[i] == 'S') {
						this.datasetCount.push({ label: 'slim', value: '0' });
					} else {
						this.datasetCount.push({ label: 'normal', value: totalNumDatasets[i] });
					}
				}
				return this.datasetCount;
			} catch (error) {
				console.error('Error: setDatasetsStats() - datasets-list.component.ts');
				this.errorTitle = this.datasetListErrorTitle;
				this.errorMessage = this.datasetListErrorMessage;
			}
		});

		this.datasetsService.getResourcesNumber().subscribe(resources => {
			try {
				this.resourceCount = [];
				let totalNumResources = '';
				totalNumResources = JSON.parse(resources).result.count + '';
				while (totalNumResources.length < 8) totalNumResources = 'S' + totalNumResources;
				for (var i = 0; i < totalNumResources.length; i++) {
					if (totalNumResources[i] == 'S') {
						this.resourceCount.push({ label: 'slim', value: '0' });
					} else {
						this.resourceCount.push({ label: 'normal', value: totalNumResources[i] });
					}
				}
				return this.resourceCount;
			} catch (error) {
				console.error('Error: setDatasetsStats() - datasets-list.component.ts');
				this.errorTitle = this.datasetListErrorTitle;
				this.errorMessage = this.datasetListErrorMessage;
			}
		});
	}
}
