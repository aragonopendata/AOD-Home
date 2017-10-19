import { Component, OnInit } from '@angular/core';
import { DatasetsService } from '../../../../services/web/datasets.service';
import { Dataset } from '../../../../models/Dataset';
import { DatasetHomer } from '../../../../models/DatasetHomer';
import { ResourceAux } from '../../../../models/ResourceAux';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../../../app.constants';

@Component({
	selector: 'app-datasets-detail',
	templateUrl: './datasets-detail.component.html',
	styleUrls: ['./datasets-detail.component.css']
})

export class DatasetsDetailComponent implements OnInit {

	dataset: Dataset = new Dataset();
	datasetHomer: DatasetHomer = new DatasetHomer();
	extraDictionary: string;
	extraDictionaryURL: string[];
	extraDataQuality: string;
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

	hovers: any[] = [];

	constructor(private datasetsService: DatasetsService, private activatedRoute: ActivatedRoute) {
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
				this.datasetHomer.package_id =  params[Constants.ROUTER_LINK_DATA_PARAM_DATASET_HOMER_NAME];
			} catch (error) {
				console.error("Error: ngOnInit() params - datasets-detail.component.ts");
			}
		});

		if(this.dataset.name){
			this.loadDataset(this.dataset);
		}
		if(this.datasetHomer.package_id){
			this.loadDatasetHomer(this.datasetHomer);
		}
	}

	initializeDataset() {
		this.dataset = new Dataset();
		this.resourcesAux = new Array();
		this.datasetsRecommended = new Array();
	}
	
	loadDataset(dataset: Dataset) {
		this.initializeDataset();
		this.datasetsService.getDatasetByName(dataset.name).subscribe(dataResult => {
			try {
				this.dataset = JSON.parse(dataResult).result;
				this.getExtras();
				this.getExtrasIAEST();
				this.getDatasetsRecommended();
				this.makeFileSourceList();
			} catch (error) {
				console.error("Error: loadDataset() - datasets-detail.component.ts");
			}
		});
	}

	loadDatasetHomer(datasetHomer: DatasetHomer) {
		this.datasetHomer = new DatasetHomer();
		this.datasetsService.getDatasetHomerByPackageId(datasetHomer.package_id).subscribe(dataResult => {
			try {
				this.datasetHomer = JSON.parse(dataResult).response.docs[0];
			} catch (error) {
				console.error("Error: loadDatasetHomer() - datasets-detail.component.ts");
			}
		});
	}

	getExtras() {
		console.log('Obteniendo extras del dataset');
		this.extraDictionaryURL = [];
		for (var index = 0; index < this.dataset.extras.length; index++) {
			if (this.dataset.extras[index].key.indexOf(Constants.DATASET_EXTRA_DATA_DICTIONARY_URL) == 0) {
				this.extraDictionaryURL.push(this.dataset.extras[index].value);
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
			}
		}
	}

	getExtrasIAEST() {
		if(this.dataset.extrasIAEST){
			console.log('Obteniendo extras IAEST del dataset');
			for (var index = 0; index < this.dataset.extrasIAEST.length; index++) {
				switch (this.dataset.extrasIAEST[index].key) {
					case Constants.DATASET_EXTRA_IAEST_TEMA_ESTADISTICO:
						this.extraIAESTTemaEstadistico = this.dataset.extrasIAEST[index].value;
					break;
					case Constants.DATASET_EXTRA_IAEST_UNIDAD_ESTADISTICA:
						this.extraIAESTUnidadEstadistica = this.dataset.extrasIAEST[index].value;
					break;
					case Constants.DATASET_EXTRA_IAEST_POBLACION_ESTADISTICA:
						this.extraIAESTPoblacionEstadistica = this.dataset.extrasIAEST[index].value;
					break;
					case Constants.DATASET_EXTRA_IAEST_UNIDAD_MEDIDA:
						this.extraIAESTUnidadMedida = this.dataset.extrasIAEST[index].value;
					break;
					case Constants.DATASET_EXTRA_IAEST_TIPO_OPERACION:
						this.extraIAESTTipoOperacion = this.dataset.extrasIAEST[index].value;
					break;
					case Constants.DATASET_EXTRA_IAEST_TIPOLOGIA_DATOS_ORIGEN:
						this.extraIAESTTipologiaDatosOrigen = this.dataset.extrasIAEST[index].value;	
					break;
					case Constants.DATASET_EXTRA_IAEST_FUENTE:
						this.extraIAESTFuente = this.dataset.extrasIAEST[index].value;
					break;
					case Constants.DATASET_EXTRA_IAEST_TRATAMIENTO_ESTADISTICO:
						this.extraIAESTTratamientoEstadistico = this.dataset.extrasIAEST[index].value;
					break;
					case Constants.DATASET_EXTRA_IAEST_LEGISLACION_UE:
						this.extraIAESTLegislacionUE = this.dataset.extrasIAEST[index].value;
					break;
				}
			}
		}	
	}

	getDatasetsRecommended() {
		let datasetRecommendedByTopic: Dataset = new Dataset();
		let datasetRecommendedByOrganization: Dataset = new Dataset();
		let datasetRecommendedByTag: Dataset = new Dataset();

		this.datasetsService.getDatasetsByTopic(this.dataset.groups[0].name, null, 1, 1, this.dataset.type).subscribe(topicDataResult => {
			try {
				datasetRecommendedByTopic = JSON.parse(topicDataResult).result.results[0];
				if(this.isDatasetDefined(datasetRecommendedByTopic) && !this.existsDatasetRecommended(datasetRecommendedByTopic)) {
					if (datasetRecommendedByTopic.groups) {
						for (var i = 0; i < datasetRecommendedByTopic.groups.length; i++) {
							let startIndex = +datasetRecommendedByTopic.groups[i].image_display_url.indexOf('ckan/temas/')+11;
							let myFormatImageUrl = datasetRecommendedByTopic.groups[i].image_display_url.slice(startIndex, datasetRecommendedByTopic.groups[i].image_display_url.length);
							datasetRecommendedByTopic.groups[i].image_url = 'public/i/temas/'+myFormatImageUrl;
						}
					}					
					this.datasetsRecommended.push(datasetRecommendedByTopic);
				}
			} catch (error) {
				console.error("Error: getDatasetsRecommended() - datasets-detail.component.ts");
			}
		});
		this.datasetsService.getDatasetsByOrganization(this.dataset.organization.name, null, 1, 1, this.dataset.type).subscribe(orgDataResult => {
			try {
				datasetRecommendedByOrganization = JSON.parse(orgDataResult).result.results[0];
				if(this.isDatasetDefined(datasetRecommendedByOrganization) && !this.existsDatasetRecommended(datasetRecommendedByOrganization)) {					
					if (datasetRecommendedByOrganization.groups) {
						for (var i = 0; i < datasetRecommendedByOrganization.groups.length; i++) {
							let startIndex = +datasetRecommendedByOrganization.groups[i].image_display_url.indexOf('ckan/temas/')+11;
							let myFormatImageUrl = datasetRecommendedByOrganization.groups[i].image_display_url.slice(startIndex, datasetRecommendedByOrganization.groups[i].image_display_url.length);
							datasetRecommendedByOrganization.groups[i].image_url = 'public/i/temas/'+myFormatImageUrl;
						}
					}					
					this.datasetsRecommended.push(datasetRecommendedByOrganization);
				}
			} catch (error) {
				console.error("Error: getDatasetsRecommended() - datasets-detail.component.ts");
			}
		});

		let tagsArray = [];
		tagsArray.push({ name: this.dataset.tags[0].name, value: this.dataset.tags[0].name });
		this.datasetsService.getDatasetsBytags(null, 1, 1, tagsArray).subscribe(tagDataResult => {
			try {
				datasetRecommendedByTag = JSON.parse(tagDataResult).result.results[0];
				if(this.isDatasetDefined(datasetRecommendedByTag) && !this.existsDatasetRecommended(datasetRecommendedByTag)) {
					if (datasetRecommendedByTag.groups) {
						for (var i = 0; i < datasetRecommendedByTag.groups.length; i++) {
							let startIndex = +datasetRecommendedByTag.groups[i].image_display_url.indexOf('ckan/temas/')+11;
							let myFormatImageUrl = datasetRecommendedByTag.groups[i].image_display_url.slice(startIndex, datasetRecommendedByTag.groups[i].image_display_url.length);
							datasetRecommendedByTag.groups[i].image_url = 'public/i/temas/'+myFormatImageUrl;
						}
					}		
					this.datasetsRecommended.push(datasetRecommendedByTag);
				}
				this.setHovers();
			} catch (error) {
				console.error("Error: getDatasetsRecommended() - datasets-detail.component.ts");
			}
		});
	}

	makeFileSourceList() {
		console.log('Obteniendo los recursos para mostrarlos en el dataset');
		for (let newRes of this.dataset.resources) {
			this.keepDataResource(newRes.name, newRes.url, newRes.format);
		}
	}

	keepDataResource (name: string, url: string, format: string) {
		var i: number;
		var existsSource: boolean;
		existsSource = false;
		for (i = 0; i < this.resourcesAux.length; i++) {
			if (this.existsResourceWithSameName(this.resourcesAux[i].name, name)) {
				this.insertSourceWithOtherFormat(i,url,format);
				existsSource = true;
			}
		}

		if (!existsSource) {
			this.insertNewResource(name, url, format);
		}
	}

	existsResourceWithSameName (resourceAuxName: string, newResourceName: string) {
		if (resourceAuxName == newResourceName) {
			return true;
		} else {
			return false;
		}
	}

	insertSourceWithOtherFormat(position: number, url: string, format: string) {
		this.resourcesAux[position].sources.push(url);
		this.resourcesAux[position].formats.push(format);
	}

	insertNewResource(name: string, url: string, format: string) {
		var newResourceAux: ResourceAux = new ResourceAux();
		newResourceAux.name = name;
		newResourceAux.sources = new Array();
		newResourceAux.sources.push(url);
		newResourceAux.formats = new Array();
		newResourceAux.formats.push(format);
		this.resourcesAux.push(newResourceAux);
	}

	downloadFile(url: string) {
		window.open(url, '_blank');
	}

	isDatasetDefined(dataset: Dataset) {
		if(dataset && dataset != null && dataset != undefined) {
			return true;
		} else {
			return false;
		}
	}

	existsDatasetRecommended (dataset: Dataset) {
		let exists = false;
		for (let dsRecommended of this.datasetsRecommended) {
			if(dataset.name == dsRecommended.name) {
				exists = true;
			}
		}
		if (dataset.name == this.dataset.name) {
			exists = true;
		}

		return exists;
	}

	setHovers() {
		for (let ds of this.datasetsRecommended) {
			this.hovers.push({ label: ds.name, hover: false });
		}	
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

	showDataset(dataset: Dataset) {
		this.datasetsService.setDataset(dataset);
		this.loadDataset(dataset);
	}

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
}
