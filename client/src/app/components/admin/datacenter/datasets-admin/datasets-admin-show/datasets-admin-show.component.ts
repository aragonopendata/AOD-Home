import { ResourceView } from './../../../../../models/ResourceView';
import { Component, OnInit } from '@angular/core';
import { DatasetsService } from '../../../../../services/web/datasets.service';
import { Dataset } from '../../../../../models/Dataset';
import { ResourceAux } from '../../../../../models/ResourceAux';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../../../../app.constants';
import { DomSanitizer } from '@angular/platform-browser';
import { DatasetsAdminService } from 'app/services/admin/datasets-admin.service';
import { AuthenticationService } from 'app/services/security/authentication.service';
declare var jQuery:any;

@Component({
	selector: 'app-datasets-admin-show',
	templateUrl: './datasets-admin-show.component.html',
	styleUrls: ['./datasets-admin-show.component.css']
})
export class DatasetsAdminShowComponent implements OnInit {

	extrasIAESTNotEmpty: boolean = false;
	dataset: Dataset = new Dataset();
	datasetLoaded: boolean = false;
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

	extraIAESTTemaEstadistico: string;
	extraIAESTUnidadEstadistica: string;
	extraIAESTPoblacionEstadistica: string;
	extraIAESTUnidadMedida: string;
	extraIAESTTipoOperacion: string;
	extraIAESTTipologiaDatosOrigen: string;
	extraIAESTFuente: string;
	extraIAESTTratamientoEstadistico: string;
	extraIAESTLegislacionUE: string;
	resourceView: ResourceView[];
	iframeRes:string;
	iframeError:string;

	showEdit: boolean = false;
	dataPreview: boolean = false;

	resourcesAux: ResourceAux[] = new Array();
	resourcesEmpty: boolean = false;
	//Dynamic URL build parameters
	assetsUrl: string;
	routerLinkDatasetList: string;
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


	constructor(private datasetsAdminService: DatasetsAdminService, private activatedRoute: ActivatedRoute
		, public sanitizer: DomSanitizer, public router: Router, public autenticationService: AuthenticationService) {
		this.datasetListErrorTitle = Constants.DATASET_LIST_ERROR_TITLE;
		this.datasetListErrorMessage = Constants.DATASET_LIST_ERROR_MESSAGE;
		this.routerLinkDatasetList = Constants.ROUTER_LINK_ADMIN_DATACENTER_DATASETS;
		this.routerLinkDataCatalogDataset = Constants.ROUTER_LINK_DATA_CATALOG_DATASET;
		this.routerLinkDataCatalogTopics = Constants.ROUTER_LINK_DATA_CATALOG_TOPICS;
		this.routerLinkDataCatalogTags = Constants.ROUTER_LINK_DATA_CATALOG_TAGS;
		this.routerLinkDataOrgs = Constants.ROUTER_LINK_DATA_ORGANIZATIONS;
		this.routerLinkFacebookShare = Constants.SHARE_FACEBOOK + window.location.href;
		this.routerLinkTwitterShare = Constants.SHARE_TWITTER + window.location.href;
		this.routerLinkGooglePlusShare = Constants.SHARE_GOOGLE_PLUS + window.location.href;
		this.assetsUrl = Constants.AOD_ASSETS_BASE_URL;
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			try {
				this.dataset.name =  params[Constants.ROUTER_LINK_DATA_PARAM_DATASET_NAME];
			} catch (error) {
				console.error("Error: ngOnInit() params - datasets-detail.component.ts");
				this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
			}
		});
		if(this.dataset.name){
			this.loadDataset(this.dataset);
		}
		this.showEditButton();
	}

	initializeDataset() {
		this.dataset = new Dataset();
		this.resourcesAux = new Array();
	}
	
	loadDataset(dataset: Dataset) {
		this.initializeDataset();
		this.datasetsAdminService.getDatasetByName(dataset.name).subscribe(dataResult => {
			try {
				if(dataResult != Constants.ADMIN_DATASET_ERR_LOAD_DATASET){
					this.datasetLoaded = true;
					this.dataset = JSON.parse(dataResult).result;
					this.getResourceView();
					this.getExtras();
					this.makeFileSourceList();
				}else{
					this.disableButtons();
				}
			} catch (error) {
				console.error("Error: loadDataset() - datasets-admin-show.component.ts");
				this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
			}
		});
	}

	disableButtons(){
		jQuery("#editButton").prop("disabled",true);
	}

	getResourceView(){
		this.resourceView = [];
		if (this.dataset.resources != undefined ){
			for (var i = 0; i < this.dataset.resources.length; i++) {
				this.datasetsAdminService.getDatasetResourceView(this.dataset.resources[i].id).subscribe(result => {
					try {
						if(JSON.parse(result).result[0]){
							this.resourceView.push(JSON.parse(result).result[0]);
						}else{
							this.resourceView.push(null);
						}
					} catch (error) {
						console.error("Error: getResourceView() - datasets-admin-show.component.ts");
						this.errorTitle = this.datasetListErrorTitle;
						this.errorMessage = this.datasetListErrorMessage;
					}
				});
	
			}
		}
	}

	getExtras() {
		this.extraDictionaryURL = [];
		this.extraDataQualityURL = [];
		for (var index = 0; index < this.dataset.extras.length; index++) {
			if (this.dataset.extras[index].key.indexOf(Constants.DATASET_EXTRA_DATA_DICTIONARY_URL) == 0) {
				this.extraDictionaryURL.push(this.dataset.extras[index].value);
			}
			if (this.dataset.extras[index].key.indexOf(Constants.DATASET_EXTRA_DATA_QUALITY_URL) == 0) {
				this.extraDataQualityURL.push(this.dataset.extras[index].value);
			}
			switch (this.dataset.extras[index].key) {
				case Constants.DATASET_EXTRA_DATA_DICTIONARY:
					this.extraDictionary = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_DATA_QUALITY:
					this.extraDataQuality = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_FREQUENCY:
					this.extraFrequency = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_GRANULARITY:
					this.extraGranularity = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_TEMPORAL_FROM:
					this.extraTemporalFrom = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_TEMPORAL_UNTIL:
					this.extraTemporalUntil = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_NAME_ARAGOPEDIA:
					this.extraNameAragopedia = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_SHORT_URI_ARAGOPEDIA:
					this.extraShortUriAragopedia = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_TYPE_ARAGOPEDIA:
					this.extraTypeAragopedia = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_URI_ARAGOPEDIA:
					this.extraUriAragopedia = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_IAEST_TEMA_ESTADISTICO:
					this.extrasIAESTNotEmpty = true;
					this.extraIAESTTemaEstadistico = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_IAEST_UNIDAD_ESTADISTICA:
					this.extrasIAESTNotEmpty = true;
					this.extraIAESTUnidadEstadistica = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_IAEST_POBLACION_ESTADISTICA:
					this.extrasIAESTNotEmpty = true;
					this.extraIAESTPoblacionEstadistica = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_IAEST_UNIDAD_MEDIDA:
					this.extrasIAESTNotEmpty = true;
					this.extraIAESTUnidadMedida = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_IAEST_TIPO_OPERACION:
					this.extrasIAESTNotEmpty = true;
					this.extraIAESTTipoOperacion = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_IAEST_TIPOLOGIA_DATOS_ORIGEN:
					this.extrasIAESTNotEmpty = true;
					this.extraIAESTTipologiaDatosOrigen = this.dataset.extras[index].value;	
					break;
				case Constants.DATASET_EXTRA_IAEST_FUENTE:
					this.extrasIAESTNotEmpty = true;
					this.extraIAESTFuente = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_IAEST_TRATAMIENTO_ESTADISTICO:
					this.extrasIAESTNotEmpty = true;
					this.extraIAESTTratamientoEstadistico = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_IAEST_LEGISLACION_UE:
					this.extrasIAESTNotEmpty = true;
					this.extraIAESTLegislacionUE = this.dataset.extras[index].value;
				break;
			}
		}
		if((this.extraDataQuality == undefined || this.extraDataQuality == '') && this.extraDataQualityURL.length != 0){
			this.extraDataQuality = Constants.DATASET_EXTRA_DATA_QUALITY_DEFAULT;
		}
		if((this.extraDictionary == undefined || this.extraDictionary == '') && this.extraDictionaryURL.length != 0){
			this.extraDictionary = Constants.DATASET_EXTRA_DATA_DICTIONARY_DEFAULT;
		}
	}

	makeFileSourceList() {
		if(this.dataset.resources.length > 0){
			for (let newRes of this.dataset.resources) {
				this.keepDataResource(newRes.id, newRes.name, newRes.url, newRes.format);
			}
		}else{
			this.resourcesEmpty = true;
		}
	}

	keepDataResource (id:string, name: string, url: string, format: string) {
		var i: number;
		var existsSource: boolean;
		existsSource = false;
		for (i = 0; i < this.resourcesAux.length; i++) {
			if (this.existsResourceWithSameName(this.resourcesAux[i].name, name)) {
				this.insertSourceWithOtherFormat(id, i,url,format);
				existsSource = true;
			}
		}

		if (!existsSource) {
			this.insertNewResource(id, name, url, format);
		}
	}

	existsResourceWithSameName (resourceAuxName: string, newResourceName: string) {
		if (resourceAuxName == newResourceName) {
			return true;
		} else {
			return false;
		}
	}

	insertSourceWithOtherFormat(id:string, position: number, url: string, format: string) {
		this.resourcesAux[position].sources.push(url);
		this.resourcesAux[position].formats.push(format);
		this.resourcesAux[position].sources_ids.push(id);		
	}

	insertNewResource(id: string, name: string, url: string, format: string) {
		var newResourceAux: ResourceAux = new ResourceAux();
		newResourceAux.name = name;
		newResourceAux.sources = new Array();
		newResourceAux.sources.push(url);
		newResourceAux.formats = new Array();
		newResourceAux.formats.push(format);
		newResourceAux.sources_ids = new Array();
		newResourceAux.sources_ids.push(id);
		this.resourcesAux.push(newResourceAux);
	}

	isDatasetDefined(dataset: Dataset) {
		if(dataset && dataset != null && dataset != undefined) {
			return true;
		} else {
			return false;
		}
	}

	showDataset(dataset: Dataset) {
		this.datasetsAdminService.setDataset(dataset);
		this.loadDataset(dataset);
	}

	downloadRDF(datasetName: string){
		this.datasetsAdminService.getDatasetRDF(datasetName).subscribe(result => {
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

	loadResourceIframe(resource: any, index: number){
		let res = resource.sources_ids[index];
		let format = resource.formats[index];
		let source = resource.sources[index];
		try {
			for (var i = 0; i < this.resourceView.length; i++) {
				if (this.resourceView[i] && this.resourceView[i].resource_id  && this.resourceView[i].resource_id == res) {
					if (format != 'HTML'){
						this.iframeRes = Constants.AOD_API_CKAN_BASE_URL+Constants.DATASET_DETAIL_CKAN_PREVIEW_URL_PARAM_DATASET+this.dataset.name+Constants.DATASET_DETAIL_CKAN_PREVIEW_URL_PARAM_RESOURCE+this.resourceView[i].resource_id+Constants.DATASET_DETAIL_CKAN_PREVIEW_URL_PARAM_VIEW+this.resourceView[i].id;
					} else {
						this.iframeRes = source;
					}
					this.iframeError = undefined;
				}else{
					this.iframeError = Constants.DATASET_LIST_ERROR_IFRAME_MESSAGE;
				}
			}
		} catch (error) {
			console.error("Error: loadResourceIframe() - datasets-admin-show.component.ts");
		}	
	}

	removeResourceIframe(){
		this.iframeRes = undefined;
	}

	goToDatasetList(){
		this.router.navigate(['/' + this.routerLinkDatasetList]); 
	}	

	openUrl(url: string){
		if(url.substring(0,4)=='http'){
			window.open(url,'_blank');
		}else{
			let urlAbsolute = 'http://'+url;
			window.open(urlAbsolute,'_blank');
		}
	}

	showEditButton(){
		try {
			let user = this.autenticationService.getCurrentUser();
			if(user.rol != Constants.ADMIN_USER_ROL_ORGANIZATION_MEMBER){
				this.showEdit = true;
			}
		} catch (error) {
			console.log(error);
			console.error('Error: showEditButton() - datasets-admin-show.component.ts');
		}
	}
}
