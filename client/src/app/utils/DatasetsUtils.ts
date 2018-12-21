import { Dataset } from "../models/Dataset";
import { DatasetsService } from "../services/web/datasets.service";
import { Constants } from "../app.constants";
import { ResourceAux } from "../models/ResourceAux";
import { Subject, Subscription } from "rxjs";
import { ResourceView } from "../models/ResourceView";
import { Resource } from "../models/Resource";
import { Extra } from "../models/Extra";


export class DatasetsUtils {

	resourcesAux: ResourceAux[] = new Array();
	resourceView: ResourceView[];
    dataset: Dataset;

	constructor(private datasetsService: DatasetsService){}

    getDataset(dataset: Dataset): Promise<any> {
		return new Promise((resolve, reject) => {
			this.datasetsService.getDatasetByName(dataset.name).subscribe(dataResult => {
				try {
					let dataResultValid = JSON.parse(dataResult).success;
					if (dataResultValid) {
						this.dataset = JSON.parse(dataResult).result;
					}
					resolve(dataResult);
				} catch (error) {
					reject(dataResult);
				}
			});
		});
    }
    
    getResourceView(dataset: Dataset, resourceView: ResourceView[]) {
		for (var i = 0; i < dataset.resources.length; i++) {
			this.datasetsService.getDatasetResourceView(dataset.resources[i].id).subscribe(result => {
				try {
					if (JSON.parse(result).result[0]) {
						resourceView.push(JSON.parse(result).result[0]);
					} else {
						resourceView.push(null);
					}
				} catch (error) {
					console.error("Error: getResourceView() - DatasetsUtils.component.ts");
				}
			});
		}
    }
    
    setExtras(dataset: Dataset, extras: Map<any, any>){
		var extraDictionaryURL = [];
		var extraDataQualityURL = [];
		for (let index = 0; index < dataset.extras.length; index++) {
			if (dataset.extras[index].key.indexOf(Constants.DATASET_EXTRA_DATA_DICTIONARY_URL) == 0) {
				extraDictionaryURL.push(dataset.extras[index].value);
			}else if (dataset.extras[index].key.indexOf(Constants.DATASET_EXTRA_DATA_QUALITY_URL) == 0) {
				extraDataQualityURL.push(dataset.extras[index].value);
			}else {
				extras.set(dataset.extras[index].key, dataset.extras[index].value);
			}
		}
		extras.set(Constants.DATASET_EXTRA_DATA_DICTIONARY_URL, extraDictionaryURL);
		extras.set(Constants.DATASET_EXTRA_DATA_QUALITY_URL, extraDataQualityURL);
	}
    
    makeFileSourceList(dataset: Dataset, resourcesAux: ResourceAux[]) {
		for (let newRes of dataset.resources) {
			this.keepDataResource(newRes, resourcesAux);
		}
    }
    
    keepDataResource(resource: Resource, resourcesAux: ResourceAux[]) {
		var i: number;
		var existsSource: boolean;
		existsSource = false;
		for (i = 0; i < resourcesAux.length; i++) {
			if (this.existsResourceWithSameName(resourcesAux[i].name, resource.name)) {
				resource.url = this.addFilenameToFileViewUrl(resource.url, resource.name);
				this.insertSourceWithOtherFormat(resource, i, resourcesAux);
				existsSource = true;
			}
		}

		if (!existsSource) {
			resource.url = this.addFilenameToFileViewUrl(resource.url, resource.name);
			this.insertNewResource(resource, resourcesAux);
		}
	}

	existsResourceWithSameName(resourceAuxName: string, newResourceName: string) {
		if (resourceAuxName.trim() == newResourceName.trim()) {
			return true;
		} else {
			return false;
		}
	}

	insertSourceWithOtherFormat(resource: Resource, position: number, resourcesAux: ResourceAux[]) { 
		resourcesAux[position].sources.push(resource.url);
		resourcesAux[position].formats.push(resource.format);
		resourcesAux[position].sources_ids.push(resource.id);
	}

	insertNewResource(resource: Resource, resourcesAux: ResourceAux[]) {
		var newResourceAux: ResourceAux = new ResourceAux();
		newResourceAux.name = resource.name;
		newResourceAux.sources = new Array();
		newResourceAux.sources.push(resource.url);
		newResourceAux.formats = new Array();
		newResourceAux.formats.push(resource.format);
		newResourceAux.sources_ids = new Array();
		newResourceAux.sources_ids.push(resource.id);
		resourcesAux.push(newResourceAux);
	}

	addFilenameToFileViewUrl(url: string, name: string) {
		if (url.indexOf('/GA_OD_Core/download') >= 0) {
			return url.concat('&nameRes='.concat(name))
		} else {
			return url;
		}
	}

}