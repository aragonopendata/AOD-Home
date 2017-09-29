import { Component, OnInit } from '@angular/core';
import { DatasetsService } from '../../../../services/web/datasets.service';
import { Dataset } from '../../../../models/Dataset';
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
	resourcesAux: ResourceAux[] = new Array();
	datasetsRecommended: Dataset[] = new Array();
	//Dynamic URL build parameters
	routerLinkDataCatalogTopics: string;
	routerLinkDataCatalogTags: string;

	hovers: any[] = [];

	constructor(private datasetsService: DatasetsService,
			private activatedRoute: ActivatedRoute) { 
		this.routerLinkDataCatalogTopics = Constants.ROUTER_LINK_DATA_CATALOG_TOPICS;
		this.routerLinkDataCatalogTags = Constants.ROUTER_LINK_DATA_CATALOG_TAGS;
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			this.dataset.name =  params[Constants.ROUTER_LINK_DATA_PARAM_DATASET_NAME];
		});
		this.loadDataset(this.dataset);
	}

	initializeDataset() {
		this.dataset = new Dataset();
		this.resourcesAux = new Array();
		this.datasetsRecommended = new Array();
	}

	loadDataset(dataset: Dataset) {
		this.initializeDataset();
		console.log('Dataset a buscar: ' + dataset.name);
		this.datasetsService.getDatasetByName(dataset.name).subscribe(dataResult => {
			this.dataset = JSON.parse(dataResult).result;
			this.getExtras();
			this.getDatasetsRecommended();
			this.makeFileSourceList();
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

	getDatasetsRecommended() {
		let datasetRecommendedByTopic: Dataset = new Dataset();
		let datasetRecommendedByOrganization: Dataset = new Dataset();
		let datasetRecommendedByTag: Dataset = new Dataset();

		this.datasetsService.getDatasetsByTopic(this.dataset.groups[0].name, null, 1, 1, this.dataset.type).subscribe(topicDataResult => {
			datasetRecommendedByTopic = JSON.parse(topicDataResult).result.results[0];
			if(this.isDatasetDefined(datasetRecommendedByTopic) && !this.existsDatasetRecommended(datasetRecommendedByTopic)) {
				this.datasetsRecommended.push(datasetRecommendedByTopic);
			}
		});
		this.datasetsService.getDatasetsByOrganization(this.dataset.organization.name, null, 1, 1, this.dataset.type).subscribe(orgDataResult => {
			datasetRecommendedByOrganization = JSON.parse(orgDataResult).result.results[0];
			if(this.isDatasetDefined(datasetRecommendedByOrganization) && !this.existsDatasetRecommended(datasetRecommendedByOrganization)) {
				this.datasetsRecommended.push(datasetRecommendedByOrganization);
			}
		});

		let tagsArray = [];
		tagsArray.push({ name: this.dataset.tags[0].name, value: this.dataset.tags[0].name });
		this.datasetsService.getDatasetsBytags(null, 1, 1, tagsArray).subscribe(tagDataResult => {
			datasetRecommendedByTag = JSON.parse(tagDataResult).result.results[0];
			if(this.isDatasetDefined(datasetRecommendedByTag) && !this.existsDatasetRecommended(datasetRecommendedByTag)) {
				this.datasetsRecommended.push(datasetRecommendedByTag);
			}
			this.setHovers();
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
}
