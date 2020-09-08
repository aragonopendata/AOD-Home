import { NgZone, HostListener } from '@angular/core';
import { ResourceView } from './../../../../models/ResourceView';
import { Component, OnInit } from '@angular/core';
import { DatasetsService } from '../../../../services/web/datasets.service';
import { Dataset } from '../../../../models/Dataset';
import { DatasetHomer } from '../../../../models/DatasetHomer';
import { ResourceAux } from '../../../../models/ResourceAux';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../../../app.constants';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from 'app/services/security/authentication.service';
import { UsersAdminService } from 'app/services/admin/users-admin.service';
import { GoogleAnalyticsEventsService } from "../../../../services/web/google-analytics-events.service";
import { Organization } from 'app/models/Organization';
import { Subject, Subscription } from 'rxjs';
import { DatasetsUtils } from '../../../../utils/DatasetsUtils';
import { Extra } from '../../../../models/Extra';
import { UtilsService } from '../../../../services/web/utils.service';
import { Resource } from '../../../../models/Resource';
import { FilesAdminService } from 'app/services/admin/files-admin.service';
import {MessageService} from 'primeng/api';

@Component({
	selector: 'app-datasets-detail',
	templateUrl: './datasets-detail.component.html',
	styleUrls: ['./datasets-detail.component.css']
})

export class DatasetsDetailComponent implements OnInit {

	public static doUpdate: Subject<any> = new Subject();
	openedMenu: boolean;

	dataset: Dataset = new Dataset();
	datasetHomer: DatasetHomer = new DatasetHomer();

	extras: Map<any, any> = new Map();
	extraDictionary: string;
	extraDictionaryURL: string[];
	extraDataQuality: string;
	extraDataQualityURL: string[];
	extraFrequency: string;
	extraGranularity: string;
	extraTemporalFrom: string;
	extraTemporalUntil: string;
	extraUriAragopedia: string;
	extraTypeAragopedia: string;
	extraShortUriAragopedia: string;
	extraNameAragopedia: string;

	extrasIAESTNotEmpty: boolean = false;
	extraIAESTTemaEstadistico: string;
	extraIAESTUnidadEstadistica: string;
	extraIAESTPoblacionEstadistica: string;
	extraIAESTUnidadMedida: string;
	extraIAESTPeriodoBase: string;
	extraIAESTTipoOperacion: string;
	extraIAESTTipologiaDatosOrigen: string;
	extraIAESTFuente: string;
	extraIAESTTratamientoEstadistico: string;
	extraIAESTLegislacionUE: string;
	resourceView: ResourceView[] = new Array();
	iframeRes: string;
	iframeError: string;

	resourcesAux: ResourceAux[] = new Array();
	resourcesPreview: ResourceAux[] = new Array();
	resourceCSVFromPX: ResourceAux[] = new Array();
	datasetsRecommended: Dataset[] = new Array();
	//Dynamic URL build parameters
	assetsUrl: string;
	routerLinkDataCatalogDataset: string;
	routerLinkDataCatalogTopics: string;
	routerLinkDataCatalogTags: string;
	routerLinkDataOrgs: string;
	routerLinkFacebookShare: string;
	routerLinkTwitterShare: string;
	//Error Params
	errorTitle: string;
	errorMessage: string;
	datasetListErrorTitle: string;
	datasetListErrorMessage: string;

	currentUser: any;
	userOrgs: Organization[];
	showEdit: boolean = false;
	dataPreview: boolean = false;

	showMapLink = false;

	subscription: Subscription;
	isMobileScreen: boolean;
	previewHeaders: any;
	previewData: any;
	isLoadingPreview: boolean;
	dataPreviewSelected: boolean;

	constructor(private datasetsService: DatasetsService,
		private usersAdminService: UsersAdminService,
		private authenticationService: AuthenticationService,
		private activatedRoute: ActivatedRoute, public sanitizer: DomSanitizer, private router: Router,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
		private utilsService:UtilsService,
		private filesAdminService: FilesAdminService, private messageService: MessageService, private ngZone: NgZone) {
		this.datasetListErrorTitle = Constants.DATASET_LIST_ERROR_TITLE;
		this.datasetListErrorMessage = Constants.DATASET_LIST_ERROR_MESSAGE;
		this.routerLinkDataCatalogDataset = Constants.ROUTER_LINK_DATA_CATALOG_DATASET;
		this.routerLinkDataCatalogTopics = Constants.ROUTER_LINK_DATA_CATALOG_TOPICS;
		this.routerLinkDataCatalogTags = Constants.ROUTER_LINK_DATA_CATALOG_TAGS;
		this.routerLinkDataOrgs = Constants.ROUTER_LINK_DATA_ORGANIZATIONS;
		this.routerLinkFacebookShare = Constants.SHARE_FACEBOOK + window.location.href;
		this.routerLinkTwitterShare = Constants.SHARE_TWITTER + window.location.href;
		this.assetsUrl = window["config"]["AOD_ASSETS_BASE_URL"];

		this.getOpenedMenu();

		DatasetsDetailComponent.doUpdate.subscribe(res => {
			this.initializeDataset();
			this.dataset.name = res;
			this.getDataset(this.dataset);
		});
	}

	ngOnInit() {
		this.loadResource();
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		if (event.target.innerWidth < 768) {
			this.isMobileScreen = true;
		} else {
			this.isMobileScreen = false;
		}
	}

	loadResource() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.initializeDataset();
			this.datasetsService.clearDataset();
			try {
				this.showEditButton();
				this.dataset.name = params[Constants.ROUTER_LINK_DATA_PARAM_DATASET_NAME];
				this.datasetHomer.package_id = params[Constants.ROUTER_LINK_DATA_PARAM_DATASET_HOMER_NAME];
				if (this.dataset.name) {
					this.getDataset(this.dataset);
				}
				if (this.datasetHomer.package_id) {
					this.loadDatasetHomer(this.datasetHomer);
				}
			} catch (error) {
				console.error("Error: ngOnInit() params - datasets-detail.component.ts");
				this.errorTitle = this.datasetListErrorTitle;
				this.errorMessage = this.datasetListErrorMessage;
			}
		});
	}

	initializeDataset() {
		this.dataset = new Dataset();
		this.resourcesAux = new Array();
		this.extras = new Map();
	}

	getDataset(dataset: Dataset){
		let dt = new DatasetsUtils(this.datasetsService);
		let prom = dt.getDataset(dataset);
		prom.then(data => {
			let dataValid = JSON.parse(data).success;
			if(dataValid){
				this.viewCounter();
				this.dataset = JSON.parse(data).result;
				dt.getResourceView(this.dataset, this.resourceView);
				dt.setExtras(this.dataset, this.extras);
				this.getExtras();
				this.getExtrasIAEST();
				this.checkExtrasIAESTEmpty();
				dt.makeFileSourceList(this.dataset, this.resourcesAux);
				this.checkForDataPreview(this.resourcesAux);
				if(this.checkPxResource()){
					this.addCsvResourceFromPx();
				}
				this.getDatasetsRecommended();
				this.filesAdminService.downloadFile(this.dataset.id).
				subscribe(
					response => {
						console.log(response);
						if(response.headers.get('Content-Type') === 'application/vnd.ms-excel.sheet.macroEnabled.12'){
							this.showMapLink = true;
						}
				});
			}else {
				console.error("Error: loadDataset() - datasets-detail.component.ts");
				this.errorTitle = this.datasetListErrorTitle;
				this.errorMessage = this.datasetListErrorMessage;
			}
		});
	}

	getExtras(){
		this.extraDictionary = this.extras.get(Constants.DATASET_EXTRA_DATA_DICTIONARY);
		this.extraDictionaryURL = this.extras.get(Constants.DATASET_EXTRA_DATA_DICTIONARY_URL);
		this.extraDataQuality = this.extras.get(Constants.DATASET_EXTRA_DATA_QUALITY);
		this.extraDataQualityURL = this.extras.get(Constants.DATASET_EXTRA_DATA_QUALITY_URL);
		this.extraFrequency = this.extras.get(Constants.DATASET_EXTRA_FREQUENCY);
		this.extraGranularity = this.extras.get(Constants.DATASET_EXTRA_GRANULARITY);
		this.extraTemporalFrom = this.extras.get(Constants.DATASET_EXTRA_TEMPORAL_FROM);
		this.extraTemporalUntil = this.extras.get(Constants.DATASET_EXTRA_TEMPORAL_UNTIL);
		this.extraUriAragopedia = this.extras.get(Constants.DATASET_EXTRA_URI_ARAGOPEDIA);
		this.extraTypeAragopedia = this.extras.get(Constants.DATASET_EXTRA_TYPE_ARAGOPEDIA);
		this.extraShortUriAragopedia = this.extras.get(Constants.DATASET_EXTRA_SHORT_URI_ARAGOPEDIA);
		this.extraNameAragopedia = this.extras.get(Constants.DATASET_EXTRA_NAME_ARAGOPEDIA);

		if ((this.extraDataQuality == undefined || this.extraDataQuality == '') && this.extraDataQualityURL.length != 0) {
			this.extraDataQuality = Constants.DATASET_EXTRA_DATA_QUALITY_DEFAULT;
		}
		if ((this.extraDictionary == undefined || this.extraDictionary == '') && this.extraDictionaryURL.length != 0) {
			this.extraDictionary = Constants.DATASET_EXTRA_DATA_DICTIONARY_DEFAULT;
		}
	}

	getExtrasIAEST() {
		this.extraIAESTTemaEstadistico = this.extras.get(Constants.DATASET_EXTRA_IAEST_TEMA_ESTADISTICO);
		this.extraIAESTUnidadEstadistica = this.extras.get(Constants.DATASET_EXTRA_IAEST_UNIDAD_ESTADISTICA);
		this.extraIAESTPoblacionEstadistica = this.extras.get(Constants.DATASET_EXTRA_IAEST_POBLACION_ESTADISTICA);
		this.extraIAESTUnidadMedida = this.extras.get(Constants.DATASET_EXTRA_IAEST_UNIDAD_MEDIDA);
		this.extraIAESTPeriodoBase = this.extras.get(Constants.DATASET_EXTRA_IAEST_PERIODO_BASE);
		this.extraIAESTTipoOperacion = this.extras.get(Constants.DATASET_EXTRA_IAEST_TIPO_OPERACION);
		this.extraIAESTTipologiaDatosOrigen = this.extras.get(Constants.DATASET_EXTRA_IAEST_TIPOLOGIA_DATOS_ORIGEN);
		this.extraIAESTFuente = this.extras.get(Constants.DATASET_EXTRA_IAEST_FUENTE);
		this.extraIAESTTratamientoEstadistico = this.extras.get(Constants.DATASET_EXTRA_IAEST_TRATAMIENTO_ESTADISTICO);
		this.extraIAESTLegislacionUE = this.extras.get(Constants.DATASET_EXTRA_IAEST_LEGISLACION_UE);
	}

	checkExtrasIAESTEmpty() {
		if (this.extraIAESTFuente != undefined  || 
			this.extraIAESTUnidadEstadistica != undefined ||
			this.extraIAESTPoblacionEstadistica != undefined ||
			this.extraIAESTUnidadMedida != undefined ||
			this.extraIAESTPeriodoBase != undefined ||
			this.extraIAESTTipoOperacion != undefined || 
			this.extraIAESTTipologiaDatosOrigen != undefined ||
			this.extraIAESTFuente != undefined || 
			this.extraIAESTTratamientoEstadistico != undefined ||
			this.extraIAESTLegislacionUE != undefined) {
				this.extrasIAESTNotEmpty = true;
		}
	}

	showEditButton() {
		this.showEdit = false;
		this.currentUser = this.authenticationService.currentUser;
		if (this.currentUser != undefined) {
			if (this.currentUser.rol == Constants.ADMIN_USER_ROL_GLOBAL_ADMIN) {
				this.showEdit = true;
			} else {
				if (this.currentUser.rol == Constants.ADMIN_USER_ROL_ORGANIZATION_MEMBER) {
					this.showEdit = false;
				} else {
					this.usersAdminService.getOrganizationsByCurrentUser().subscribe(orgs => {
						try {
							this.userOrgs = JSON.parse(orgs).result;
							let obj = this.userOrgs.find((org, i) => {
								if (org.name === this.dataset.organization.name) {
									this.showEdit = true;
									return true; // stop searching
								}
							});
						} catch (error) {
							console.error('Error: showEditButton() - datasets-detail.component.ts');
						}
					});
				}
			}
		}
	}

	loadDatasetHomer(datasetHomer: DatasetHomer) {
		this.datasetHomer = new DatasetHomer();
		this.datasetsService.getDatasetHomerByPackageId(datasetHomer.package_id).subscribe(dataResult => {
			try {
				this.datasetHomer = JSON.parse(dataResult).response.docs[0];
			} catch (error) {
				console.error("Error: loadDatasetHomer() - datasets-detail.component.ts");
				this.errorTitle = this.datasetListErrorTitle;
				this.errorMessage = this.datasetListErrorMessage;
			}
		});
	}

	getDatasetsRecommended() {
		this.datasetsRecommended = new Array();
		let datasetRecommendedByTopic: Dataset = new Dataset();
		let datasetRecommendedByOrganization: Dataset = new Dataset();
		let datasetRecommendedByTag: Dataset = new Dataset();
		if(this.dataset.groups != undefined && this.dataset.groups.length != 0){
			this.datasetsService.getDatasetsByTopic(this.dataset.groups[0].name, null, 1, 1, this.dataset.type).subscribe(topicDataResult => {
				try {
					if (JSON.parse(topicDataResult).result != undefined) {
						datasetRecommendedByTopic = JSON.parse(topicDataResult).result.results[0];
						if (this.isDatasetDefined(datasetRecommendedByTopic) && !this.existsDatasetRecommended(datasetRecommendedByTopic)) {
							if (datasetRecommendedByTopic.groups) {
								for (var i = 0; i < datasetRecommendedByTopic.groups.length; i++) {
									let startIndex = +datasetRecommendedByTopic.groups[i].image_display_url.indexOf('static/');
									let myFormatImageUrl = datasetRecommendedByTopic.groups[i].image_display_url.slice(startIndex, datasetRecommendedByTopic.groups[i].image_display_url.length);
									datasetRecommendedByTopic.groups[i].image_url = myFormatImageUrl;
								}
							}
							this.datasetsRecommended.push(datasetRecommendedByTopic);
						}
					}
				} catch (error) {
					console.error("Error: getDatasetsRecommended() - datasets-detail.component.ts");
					this.errorTitle = this.datasetListErrorTitle;
					this.errorMessage = this.datasetListErrorMessage;
				}
			});
		}
		this.datasetsService.getDatasetsByOrganization(this.dataset.organization.name, null, 1, 1, this.dataset.type).subscribe(orgDataResult => {
			try {
				if (JSON.parse(orgDataResult).result != undefined) {
					datasetRecommendedByOrganization = JSON.parse(orgDataResult).result.results[0];
					if (this.isDatasetDefined(datasetRecommendedByOrganization) && !this.existsDatasetRecommended(datasetRecommendedByOrganization)) {
						if (datasetRecommendedByOrganization.groups) {
							for (var i = 0; i < datasetRecommendedByOrganization.groups.length; i++) {
								let startIndex = +datasetRecommendedByOrganization.groups[i].image_display_url.indexOf('static/');
								let myFormatImageUrl = datasetRecommendedByOrganization.groups[i].image_display_url.slice(startIndex, datasetRecommendedByOrganization.groups[i].image_display_url.length);
								datasetRecommendedByOrganization.groups[i].image_url = myFormatImageUrl;
							}
						}
						this.datasetsRecommended.push(datasetRecommendedByOrganization);
					}
				}
			} catch (error) {
				console.error("Error: getDatasetsRecommended() - datasets-detail.component.ts");
				this.errorTitle = this.datasetListErrorTitle;
				this.errorMessage = this.datasetListErrorMessage;
			}
		});

		let tagsArray = [];
		if (this.dataset.tags[0] != undefined) {
			tagsArray.push({ name: this.dataset.tags[0].name, value: this.dataset.tags[0].name });
			this.datasetsService.getDatasetsBytags(null, 1, 1, tagsArray).subscribe(tagDataResult => {
				try {
					if (JSON.parse(tagDataResult).result != undefined) {
						datasetRecommendedByTag = JSON.parse(tagDataResult).result.results[0];
						if (this.isDatasetDefined(datasetRecommendedByTag) && !this.existsDatasetRecommended(datasetRecommendedByTag)) {
							if (datasetRecommendedByTag.groups) {
								for (var i = 0; i < datasetRecommendedByTag.groups.length; i++) {
									let startIndex = +datasetRecommendedByTag.groups[i].image_display_url.indexOf('static/');
									let myFormatImageUrl = datasetRecommendedByTag.groups[i].image_display_url.slice(startIndex, datasetRecommendedByTag.groups[i].image_display_url.length);
									datasetRecommendedByTag.groups[i].image_url = myFormatImageUrl;
								}
							}
							this.datasetsRecommended.push(datasetRecommendedByTag);
						}
					}
				} catch (error) {
					console.error("Error: getDatasetsRecommended() - datasets-detail.component.ts");
					this.errorTitle = this.datasetListErrorTitle;
					this.errorMessage = this.datasetListErrorMessage;
				}
			});
		}
	}

	isDatasetDefined(dataset: Dataset) {
		if (dataset && dataset != null && dataset != undefined) {
			return true;
		} else {
			return false;
		}
	}

	existsDatasetRecommended(dataset: Dataset) {
		let exists = false;
		for (let dsRecommended of this.datasetsRecommended) {
			if (dataset.name == dsRecommended.name) {
				exists = true;
			}
		}
		if (dataset.name == this.dataset.name) {
			exists = true;
		}

		return exists;
	}

	checkPxResource(){
		let hasResourcePx = false;
		this.resourcesAux.forEach(resource => {
			let newResource = new ResourceAux();
			hasResourcePx = true;
			newResource.name = resource.name;
			newResource.sources = resource.sources;
			newResource.formats = resource.formats;
			this.resourceCSVFromPX.push(newResource);
		});
		return hasResourcePx;
	}

	addCsvResourceFromPx(){
		this.resourceCSVFromPX.forEach(resourceCSV => {
			if(resourceCSV.formats.indexOf("px") !== -1){
				resourceCSV.name = resourceCSV.name.replace("px","csv");
				resourceCSV.formats = ["CSV"];
				let url = resourceCSV.sources[0].substring(resourceCSV.sources[0].indexOf("iaeaxi_docs")+("iaeaxi_docs".length+1));
				url = window["config"]["AOD_BASE_URL"] + "/aod/services/web/datasets/" + this.dataset.name + "/resourceCSV/" + url.replace(new RegExp("/", 'g'), "-")		
				resourceCSV.sources = [url];
			}
		})
	}

	downloadPxFile(resource: ResourceAux){
		window.location.href= resource.sources[0];
	}

	//Methods called from HTML.

	downloadRDF(datasetName: string) {
		this.datasetsService.getDatasetRDF(datasetName).subscribe(result => {
			let blob = new Blob(['\ufeff' + result], { type: Constants.DATASET_RDF_FORMAT_OPTIONS_RDF });
			let dwldLink = document.createElement("a");
			let url = URL.createObjectURL(blob);
			let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
			if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
				dwldLink.setAttribute('target', '_blank');
			}
			dwldLink.setAttribute('href', url);
			dwldLink.setAttribute('download', datasetName + Constants.DATASET_RDF_FILE_EXTENSION_RDF);
			dwldLink.style.visibility = 'hidden';
			document.body.appendChild(dwldLink);
			dwldLink.click();
			document.body.removeChild(dwldLink);
		});
	}

	loadResourceIframe(resource: any, index: number) {
		let res = resource.sources_ids[index];
		let format = resource.formats[index];
		let source = resource.sources[index];
		try {
			for (var i = 0; i < this.resourceView.length; i++) {
				if (this.resourceView[i] && this.resourceView[i].resource_id && this.resourceView[i].resource_id == res) {
					if (format != 'HTML') {
						this.iframeRes = window["config"]["AOD_BASE_URL"] + "/ckan" + Constants.DATASET_DETAIL_CKAN_PREVIEW_URL_PARAM_DATASET + this.dataset.name + Constants.DATASET_DETAIL_CKAN_PREVIEW_URL_PARAM_RESOURCE + this.resourceView[i].resource_id + Constants.DATASET_DETAIL_CKAN_PREVIEW_URL_PARAM_VIEW + this.resourceView[i].id;
					} else {
						this.iframeRes = source;
					}
					this.iframeError = undefined;
				} else {
					this.iframeError = Constants.DATASET_LIST_ERROR_IFRAME_MESSAGE;
				}
			}
		} catch (error) {
			console.error("Error: loadResourceIframe() - datasets-detail.component.ts");
		}
	}

	removeResourceIframe() {
		this.iframeRes = undefined;
	}

	openUrl(url: string) {
		if (url.substring(0, 4) == 'http') {
			window.open(url, '_blank');
		} else {
			let urlAbsolute = 'http://' + url;
			window.open(urlAbsolute, '_blank');
		}
	}

	submitEvent(href, format) {

		if (!String.prototype.startsWith) {
			String.prototype.startsWith = function(searchString, position) {
			  position = position || 0;
			  return this.indexOf(searchString, position) === position;
			};
		}

		var path = href;

		if (format == "RDF") {
			path = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS_RDF + '/' + href;
		}

		if (path.substring(0, 4) != 'http') {
			path = 'http://' + path;
		}


		var urlHack = document.createElement('a');
		urlHack.href = path
		path = urlHack.pathname;

		var urlAux = document.createElement('a');
		urlAux.href = window["config"]["AOD_BASE_URL"];

		if (urlHack.host == urlAux.host) {

			if(!path.startsWith('/')){
				path = '/' + path;
			}

			var filetypes = /\.(rar|zip|exe|pdf|doc*|xls*|ppt*|mp3|mp4|txt|7z|bz2|tar|gz|tgz|avi|wma|flv|mpg|wmv|odt|rdf)$/;
			var extension = (/[.]/.exec(path)) ? /[^.]+$/.exec(path) : undefined;
			if (path && path.match(filetypes)) {
				console.log("ENVIADO")
				this.googleAnalyticsEventsService.emitEvent('File Download', extension[0], path);
			} else {
				var filetypes2 = /(rar|zip|exe|pdf|doc*|xls*|ppt*|mp3|mp4|txt|7z|bz2|tar|gz|tgz|avi|wma|flv|mpg|wmv|odt|rdf)$/;
				var value = format.toLowerCase();
				if (value.match(filetypes2)) {
					console.log("ENVIADO")
					this.googleAnalyticsEventsService.emitEvent('File Download', value, path);
				}
			}
		}
	}

	viewCounter(){
		if(this.checkUniqueUser()){
			this.datasetsService.trackingDataset(this.dataset.name).subscribe( result => {
				if(!result) { console.error("Error: viewCounter() - datasets-detail.component.ts") }
			});
		}
	}

	checkUniqueUser(){
		this.datasetsService.refreshUser();
		if(!this.datasetsService.currentUserKey) { 
			this.datasetsService.setCurrentUserKey(this.userKeyGenerator(16, Constants.DATASET_DETAIL_CHARS_FOR_USER_KEY));
		}
		return true;
	}

    getOpenedMenu(){
        this.utilsService.openedMenuChange.subscribe(value => {
			this.openedMenu = value;
		});
	}

	userKeyGenerator(length, chars) {
		var result = '';
		for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}

	downloadMapFile($event) {
		this.filesAdminService.downloadFile(this.dataset.id).
		subscribe(
			response => {
				console.log(response);
				if(response.headers.get('Content-Type') === 'application/vnd.ms-excel.sheet.macroEnabled.12'){
					let url = window["config"]["AOD_BASE_URL"] + Constants.XLMS_PATH + this.dataset.id + '/mapeo_ei2a.xlsm?q=' + Date.now();
					console.log(url);
					window.open(url, '_blank');
				}
		});

	}

	downloadMapFileAsCSV($event) {
		let url = window["config"]["AOD_BASE_URL"] + Constants.XLMS_PATH + this.dataset.id + '/mapeo_ei2a.csv?q=' + Date.now();
		window.open(url, '_blank');
	}

	rateDataset(event) {
		try {
			this.datasetsService.getIpCliente().subscribe((res: any) => {
				var ip = res.ip;
				this.datasetsService.rateDataset(this.dataset.name, event.value, ip).subscribe( response => {
					if(response.statusCode != 500){
						this.ngZone.run(() => {
							this.messageService.add({severity:'success', detail:'¡Gracias por valorar estos datos!'});
						});
						this.loadResource();
					} else {
						this.ngZone.run(() => {
							this.messageService.add({severity:'error', summary:'Error al registrar el voto.', detail:'No ha sido posible registrar el voto debido a un fallo en la comunicación con el servidor.'});
						});
					}
				});
			});
		} catch (error) {
			console.error('Error rateDataset() - datasets-detail.component.ts');
			this.ngZone.run(() => {
				this.messageService.add({severity:'error', summary:'Error al registrar el voto.', detail:'Ha ocurrido un error en el registro del voto.'});
			});
		}
	}

	checkForDataPreview(resAux) {
		let resourcesPreview = [];
		resourcesPreview = JSON.parse(JSON.stringify(resAux));
		for (let i = 0; i < resourcesPreview.length; i++) {
			for (let j = 0; j < resourcesPreview[i].formats.length; j++) {
				if(!this.isResourceSupportPreview(resourcesPreview[i].formats[j])) {
					resourcesPreview[i].formats.splice(j, 1);
					resourcesPreview[i].sources.splice(j, 1);
					resourcesPreview[i].sources_ids.splice(j, 1);
					j -= 1;
				}
			}
		}
		this.resourcesPreview = resourcesPreview;
	}

	isResourceSupportPreview(format) {
		let isCSV = false;
		if ("CSV" == format) {
			this.dataPreview = true;
			isCSV = true;
		}
		return isCSV;
	}

	loadPreview(resource) {
		this.iframeError = undefined;
		this.previewHeaders = new Array();
		this.previewData = new Array();
		this.isLoadingPreview = true;
		this.datasetsService.previewFile(resource.sources[0]).subscribe( response => {
			if(response.status == 200){
				this.iframeError = undefined;
				switch (resource.formats[0]) {
					case "CSV":
						this.processCSV(response.file)
						break;
					default:
						console.log("Error, el formato no esta soportado");
						this.iframeError = Constants.DATASET_LIST_ERROR_IFRAME_MESSAGE;
						break;
				}
				this.dataPreviewSelected = true;
			} else {
				this.iframeError = Constants.DATASET_LIST_ERROR_IFRAME_MESSAGE;
			}
			this.isLoadingPreview = false;
		});
	}

	processCSV(body){
		body = body.replace(/"/g,'');
		this.previewHeaders  = body.split("\n").slice(0, 1)[0].split(";");
		this.previewData = body.split("\n").slice(1, 11);
		this.previewData.forEach((row, index) => {
			this.previewData[index] = row.split(";");
		});
	}

	resetPreview() {
		this.iframeError = undefined;
		this.dataPreviewSelected = false;
		this.isLoadingPreview = false;
	}
}
