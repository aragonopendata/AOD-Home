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
import { Subject } from 'rxjs';
import { DatasetsUtils } from '../../../../utils/DatasetsUtils';
import { Extra } from '../../../../models/Extra';

@Component({
	selector: 'app-datasets-detail',
	templateUrl: './datasets-detail.component.html',
	styleUrls: ['./datasets-detail.component.css']
})

export class DatasetsDetailComponent implements OnInit {

	public static doUpdate: Subject<any> = new Subject();

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
	extraIAESTTipoOperacion: string;
	extraIAESTTipologiaDatosOrigen: string;
	extraIAESTFuente: string;
	extraIAESTTratamientoEstadistico: string;
	extraIAESTLegislacionUE: string;
	resourceView: ResourceView[] = new Array();
	iframeRes: string;
	iframeError: string;

	resourcesAux: ResourceAux[] = new Array();
	datasetsRecommended: Dataset[] = new Array();
	//Dynamic URL build parameters
	assetsUrl: string;
	routerLinkDataCatalogDataset: string;
	routerLinkDataCatalogTopics: string;
	routerLinkDataCatalogTags: string;
	routerLinkDataOrgs: string;
	routerLinkFacebookShare: string;
	routerLinkTwitterShare: string;
	routerLinkGooglePlusShare: string;
	//Error Params
	errorTitle: string;
	errorMessage: string;
	datasetListErrorTitle: string;
	datasetListErrorMessage: string;

	currentUser: any;
	userOrgs: Organization[];
	showEdit: boolean = false;
	dataPreview: boolean = false;

	constructor(private datasetsService: DatasetsService, private usersAdminService: UsersAdminService, private authenticationService: AuthenticationService, private activatedRoute: ActivatedRoute, public sanitizer: DomSanitizer, public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
		this.datasetListErrorTitle = Constants.DATASET_LIST_ERROR_TITLE;
		this.datasetListErrorMessage = Constants.DATASET_LIST_ERROR_MESSAGE;
		this.routerLinkDataCatalogDataset = Constants.ROUTER_LINK_DATA_CATALOG_DATASET;
		this.routerLinkDataCatalogTopics = Constants.ROUTER_LINK_DATA_CATALOG_TOPICS;
		this.routerLinkDataCatalogTags = Constants.ROUTER_LINK_DATA_CATALOG_TAGS;
		this.routerLinkDataOrgs = Constants.ROUTER_LINK_DATA_ORGANIZATIONS;
		this.routerLinkFacebookShare = Constants.SHARE_FACEBOOK + window.location.href;
		this.routerLinkTwitterShare = Constants.SHARE_TWITTER + window.location.href;
		this.routerLinkGooglePlusShare = Constants.SHARE_GOOGLE_PLUS + window.location.href;
		this.assetsUrl = Constants.AOD_ASSETS_BASE_URL;

		DatasetsDetailComponent.doUpdate.subscribe(res => {
			this.initializeDataset();
			this.dataset.name = res;
			this.getDataset(this.dataset);
		});
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			try {
				this.showEditButton();
				this.dataset.name = params[Constants.ROUTER_LINK_DATA_PARAM_DATASET_NAME];
				this.datasetHomer.package_id = params[Constants.ROUTER_LINK_DATA_PARAM_DATASET_HOMER_NAME];
			} catch (error) {
				console.error("Error: ngOnInit() params - datasets-detail.component.ts");
				this.errorTitle = this.datasetListErrorTitle;
				this.errorMessage = this.datasetListErrorMessage;
			}
		});

		if (this.dataset.name) {
			this.getDataset(this.dataset);
		}
		if (this.datasetHomer.package_id) {
			this.loadDatasetHomer(this.datasetHomer);
		}
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
				this.dataset = JSON.parse(data).result;
				dt.getResourceView(this.dataset, this.resourceView);
				dt.setExtras(this.dataset, this.extras);
				this.getExtras();
				//dt.getExtrasIAEST();
				dt.makeFileSourceList(this.dataset, this.resourcesAux);
				this.getDatasetsRecommended();
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

	//Methods called from HTML.

	showDataset(dataset: Dataset) {
		this.initializeDataset();
		this.datasetsService.setDataset(dataset);
		this.getDataset(dataset);
	}

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
						this.iframeRes = Constants.AOD_API_CKAN_BASE_URL + Constants.DATASET_DETAIL_CKAN_PREVIEW_URL_PARAM_DATASET + this.dataset.name + Constants.DATASET_DETAIL_CKAN_PREVIEW_URL_PARAM_RESOURCE + this.resourceView[i].resource_id + Constants.DATASET_DETAIL_CKAN_PREVIEW_URL_PARAM_VIEW + this.resourceView[i].id;
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
			path = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_DATASETS_RDF + '/' + href;
		}

		if (path.substring(0, 4) != 'http') {
			path = 'http://' + path;
		}


		var urlHack = document.createElement('a');
		urlHack.href = path
		path = urlHack.pathname;

		var urlAux = document.createElement('a');
		urlAux.href = Constants.AOD_BASE_URL;

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
}
