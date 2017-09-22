import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Response, URLSearchParams } from '@angular/http';
import { ConstantsService } from '../../app.constants';
import { Dataset } from '../../models/Dataset';

@Injectable()
export class DatasetsService {

	private baseUrl: string;
	private actionUrl: string;
	private datasets: Observable<Dataset[]>;
	private datasetsDetail: Dataset[];
	private dataset: Dataset;

	/**
	 * Datasets service class constructor.
	 * @param http - Http module.
	 * @param constants - Constants class.
	 */
	constructor(private http: Http, private constants: ConstantsService) {
		this.baseUrl = this.constants.AOD_API_WEB_BASE_URL;
	}

	/**
	 * Gets a list of all the datasets.
	 * @param sort - Sort order.
	 * @param page - Page to show.
	 * @param rows - Rows per page.
	 */
	public getDatasets(sort: string, page: number, rows: number) {
		let fullUrl = this.baseUrl + '/datasets?sort=' + sort + '&page=' + page.toString() + '&rows=' + rows.toString();
		console.log('Servicio DATASETS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}

	/**
	 * Gets a dataset by name.
	 * @param datasetName - Dataset name.
	 */
	public getDatasetByName(datasetName: string) {
		let fullUrl = this.baseUrl + '/datasets/' + datasetName;
		console.log('Servicio DATASETS - Request: ' + fullUrl);
		this.http.get(fullUrl).map(res => res.json()).subscribe(data => {
			//this.datasetsDetail = JSON.parse(data).result.results as Dataset[];
		});
	}

	/**
	 * Gets a list of datasets related to the given topic.
	 * @param topicName - Topic name.
	 * @param sort - Sort order.
	 * @param page - Page to show.
	 * @param rows - Rows per page.
	 */
	public getDatasetsByTopic(topicName: string, sort: string, page: number, rows: number) {
		let fullUrl = this.baseUrl + '/datasets/topic/' + topicName + '?sort=' + sort + '&page=' + page.toString() + '&rows=' + rows.toString();
		console.log('Servicio DATASETS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}

	/**
	 * Gets a list of datasets related to the given organization.
	 * @param organizationName - Organization name.
	 * @param sort - Sort order.
	 * @param page - Page to show.
	 * @param rows - Rows per page.
	 */
	public getDatasetsByOrganization(organizationName: string, sort: string, page: number, rows: number) {
		let fullUrl = this.baseUrl + '/datasets/organization/' + organizationName + '?sort=' + sort + '&page=' + page.toString() + '&rows=' + rows.toString();
		console.log('Servicio DATASETS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}

	/**
	 * Gets a list of dataset names which match with the given text.
	 * @param text - Text to search.
	 * @param limit - Results limit.
	 */
	public getDatasetsAutocomplete(text: string, limit: number) {
		let fullUrl = this.baseUrl + '/datasets/autocomplete?text=' + text + '&limit=' + limit.toString();
		console.log('Servicio DATASETS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}

	/**
	 * Sets a dataset.
	 * @param dataset - Dataset to set.
	 */
	public setDataset(dataset: Dataset) {
		this.dataset = dataset;
	}

	/**
	 * Gets a dataset.
	 */
	public getDataset() {
		return this.dataset;
	}

	/**
	 * Handles any error thrown.
	 * @param error - Error handled.
	 */
	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}
}