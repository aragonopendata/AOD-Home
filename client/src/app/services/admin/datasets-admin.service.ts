import { Injectable } from '@angular/core';
import { Dataset } from '../../models/Dataset';

@Injectable()
export class DatasetsAdminService {
	private dataset: Dataset;

	constructor() { }

	setDataset(dataset: Dataset) {
		this.dataset = dataset;
	}

	getDataset() {
		return this.dataset;
	}

	addToCollection(dataset: Dataset) {
		/*if (this.datasets.indexOf(dataset) !== -1) {
		return;
		}
		this.datasets.push(dataset);*/
	}

	removeDataset(dataset: Dataset) {
		//this.datasets.splice(this.datasets.indexOf(dataset), 1);
	}
}
