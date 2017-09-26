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
	public getDatasets(sort: string, page: number, rows: number, type: string) {
		let fullUrl = this.baseUrl + '/datasets?sort=' + sort + '&page=' + page.toString() + '&rows=' + rows.toString()+'&tipo='+type;
		console.log('Servicio DATASETS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}

	/**
	 * Gets a list of all the datasets by a text.
	 * @param text - Text for the search.
	 * @param sort - Sort order.
	 * @param page - Page to show.
	 * @param rows - Rows per page.
	 */
	public getDatasetsByText(sort: string, page: number, rows: number, text: string) {
		let fullUrl = this.baseUrl + '/datasets?text=' + text + '&sort=' + sort + '&page=' + page.toString() + '&rows=' + rows.toString();
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
		return this.http.get(fullUrl).map(res => res.json());
	}

	/**
	 * Gets a list of datasets related to the given topic.
	 * @param topicName - Topic name.
	 * @param sort - Sort order.
	 * @param page - Page to show.
	 * @param rows - Rows per page.
	 */
	public getDatasetsByTopic(topicName: string, sort: string, page: number, rows: number,type: string) {
		let fullUrl = this.baseUrl + '/datasets/topic/' + topicName + '?sort=' + sort + '&page=' + page.toString() + '&rows=' + rows.toString()+'&tipo='+type;
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
	public getDatasetsByOrganization(organizationName: string, sort: string, page: number, rows: number,type: string) {
		let fullUrl = this.baseUrl + '/datasets/organization/' + organizationName + '?sort=' + sort + '&page=' + page.toString() + '&rows=' + rows.toString()+'&tipo='+type;
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
	public getDatasetsBytags(sort: string, page: number, rows: number,tags:  string[]) {
		let tagsArray = [];
        let tagsQuery = '';
		tagsArray = tags;
		tagsArray.forEach(tag => {
			tagsQuery+='+'+tag.name;
		});

		let fullUrl = this.baseUrl + '/datasets/tags?sort=' + sort + '&page=' + page.toString() + '&rows=' + rows.toString()+'&tags='+tagsQuery;
		console.log('Servicio DATASETS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}
	

	/**
	 * Gets a list of the new datasets.
	 * 
	 */
	public getNewestDataset() {
		let fullUrl = this.baseUrl + '/datasets/newest';
		console.log('Servicio DATASETS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}

	/**
	 * Gets a list of the most downloaded datasets.
	 * 
	 */
	public getDownloadedDataset() {
		let fullUrl = this.baseUrl + '/datasets/downloaded';
		console.log('Servicio DATASETS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}

	/**
	 * Gets stats about datasets and resources
	 */
	public getDatasetsStats() {
		let fullUrl = this.baseUrl + '/datasets/count';
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
	 * Gets a list of Tags.
	 * 
	 */
	public getTags(query: string) {
		//TODO Change to AOD API
		let fullUrl = "http://opendata.aragon.es/datos/api/action/tag_list"
		//let fullUrl = this.baseUrl + '/tags';	
		if(query){
			fullUrl+='?q='+query;
		}
		console.log('Servicio DATASETS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
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