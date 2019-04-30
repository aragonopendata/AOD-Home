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
import { DatasetsUtils } from '../../../../../utils/DatasetsUtils';
declare var jQuery:any;

@Component({
	selector: 'app-datasets-admin-show',
	templateUrl: './datasets-admin-show.component.html',
	styleUrls: ['./datasets-admin-show.component.css']
})
export class DatasetsAdminShowComponent implements OnInit {

	extras: Map<any, any> = new Map();
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
	extraIAESTPeriodoBase: string;
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
	//Error Params
	errorTitle: string;
	errorMessage: string;
	datasetListErrorTitle: string;
	datasetListErrorMessage: string;


	constructor(private datasetsService: DatasetsService,
		private activatedRoute: ActivatedRoute,
		public sanitizer: DomSanitizer,
		public router: Router,
		public autenticationService: AuthenticationService) {
			
		this.datasetListErrorTitle = Constants.DATASET_LIST_ERROR_TITLE;
		this.datasetListErrorMessage = Constants.DATASET_LIST_ERROR_MESSAGE;
		this.routerLinkDatasetList = Constants.ROUTER_LINK_ADMIN_DATACENTER_DATASETS;
		this.routerLinkDataCatalogDataset = Constants.ROUTER_LINK_DATA_CATALOG_DATASET;
		this.routerLinkDataCatalogTopics = Constants.ROUTER_LINK_DATA_CATALOG_TOPICS;
		this.routerLinkDataCatalogTags = Constants.ROUTER_LINK_DATA_CATALOG_TAGS;
		this.routerLinkDataOrgs = Constants.ROUTER_LINK_DATA_ORGANIZATIONS;
		this.routerLinkFacebookShare = Constants.SHARE_FACEBOOK + window.location.href;
		this.routerLinkTwitterShare = Constants.SHARE_TWITTER + window.location.href;
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
			this.getDataset(this.dataset);
		}
		this.showEditButton();
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
				this.getExtrasIAEST();
				this.checkExtrasIAESTEmpty();
				dt.makeFileSourceList(this.dataset, this.resourcesAux);
			}else {
				console.error("Error: loadDataset() - datasets-detail.component.ts");
				this.errorTitle = this.datasetListErrorTitle;
				this.errorMessage = this.datasetListErrorMessage;
			}
		});
	}

	disableButtons(){
		jQuery("#editButton").prop("disabled",true);
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

	//Methods called from HTML.

	downloadRDF(datasetName: string){
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
}
