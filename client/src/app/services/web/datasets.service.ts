import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Constants } from '../../app.constants';
import { Dataset } from '../../models/Dataset';
import { DatasetHomer } from '../../models/DatasetHomer';

@Injectable()
export class DatasetsService {

	private datasetsDetail: Dataset[];
	private dataset: Dataset;
	private datasetHomer: DatasetHomer;
	public currentUserKey: string;

	constructor(private http: Http) {
		this.currentUserKey = localStorage.getItem('user_key');
	}

	public refreshUser(){
		this.currentUserKey = localStorage.getItem('user_key');
	}

	public setCurrentUserKey(key: string){
		localStorage.setItem('user_key', key);
		this.currentUserKey = localStorage.getItem('user_key');
	}

	public getDatasets(sort: string, page: number, rows: number, type: string) {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS 
						+ '?' + Constants.SERVER_API_LINK_PARAM_SORT + '=' + sort 
						+ '&' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page.toString() 
						+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows.toString() 
						+ '&' + Constants.SERVER_API_LINK_PARAM_TYPE + '=' + type;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getDatasetsByText(sort: string, page: number, rows: number, text: string) {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS 
						+ '?' + Constants.SERVER_API_LINK_PARAM_SORT + '=' + sort 
						+ '&' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page.toString() 
						+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows.toString()
						+ '&' + Constants.SERVER_API_LINK_PARAM_TEXT + '=' + text;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getDatasetByName(datasetName: string) {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS 
						+ '/' + datasetName;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getDatasetHomerByPackageId(datasetHomerName: string) {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS_HOMER 
						+ '/' + datasetHomerName;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getDatasetsByTopic(topicName: string, sort: string, page: number, rows: number, type: string) {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS_TOPIC 
						+ '/' + topicName 
						+ '?' + Constants.SERVER_API_LINK_PARAM_SORT + '=' + sort 
						+ '&' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page.toString() 
						+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows.toString() 
						+ '&' + Constants.SERVER_API_LINK_PARAM_TYPE + '=' + type;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getDatasetsByOrganization(organizationName: string, sort: string, page: number, rows: number, type: string) {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS_ORGANIZATION 
						+ '/' + organizationName 
						+ '?' + Constants.SERVER_API_LINK_PARAM_SORT + '=' + sort 
						+ '&' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page.toString() 
						+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows.toString() 
						+ '&' + Constants.SERVER_API_LINK_PARAM_TYPE + '=' + type;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getDatasetsBytags(sort: string, page: number, rows: number, tags: string[]) {
		let tagsArray = [];
		let tagsQuery = '';
		tagsArray = tags;
		tagsArray.forEach(tag => {
			tagsQuery += '+"' + tag.name + '"';
		});

		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS_TAGS 
						+ '?' + Constants.SERVER_API_LINK_PARAM_SORT + '=' + sort 
						+ '&' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page.toString() 
						+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows.toString() 
						+ '&' + Constants.SERVER_API_LINK_PARAM_TAGS + '=' + tagsQuery;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getDatasetsByStats(sort: string, page: number, rows: number, groupName: string) {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS_STATS_SEARCH 
						+ '/' + groupName 
						+ '?' + Constants.SERVER_API_LINK_PARAM_SORT + '=' + sort 
						+ '&' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page.toString() 
						+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows.toString() 
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getDatasetResourceView(resoruce_id:string) {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_URL_DATASETS_RESOURCE_VIEW 
						+ '?' + Constants.SERVER_API_LINK_PARAM_RESOURCE_ID + '=' + resoruce_id 
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getNewestDataset() {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS_NEWEST;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getDownloadedDataset() {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS_DOWNLOADED;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getDatasetsNumber() {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS_COUNT;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getResourcesNumber() {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_RESOURCES_COUNT;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getDatasetsAutocomplete(text: string, limit: number) {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS_AUTOCOMPLETE 
						+ '?' + Constants.SERVER_API_LINK_PARAM_TEXT + '=' + text 
						+ '&' + Constants.SERVER_API_LINK_PARAM_LIMIT + '=' + limit.toString();
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public setDataset(dataset: Dataset) {
		this.dataset = dataset;
	}

	public setDatasetHomer(datasetHomer: DatasetHomer) {
		this.datasetHomer = datasetHomer;
	}

	public getDataset() {
		return this.dataset;
	}

	public getTags(query: string) {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_TAGS;
		if (query) {
			fullUrl += '?q=' + query;
		}
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	/**
	 * Gets a list of all the datasets from Homer by a text.
	 * @param text - Text for the search.
	 * @param lang - Language for the search.
	 * @param sort - Sort order.
	 * @param page - Page to show.
	 * @param rows - Rows per page.
	 */
	public getDatasetsHomer(sort: string, page: number, rows: number, text: string, lang: string) {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS_HOMER 
		+ '?' + Constants.SERVER_API_LINK_PARAM_SORT + '=' + sort 
		+ '&' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page.toString() 
		+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows.toString()
		+ '&' + Constants.SERVER_API_LINK_PARAM_LANG + '=' + lang
		+ '&' + Constants.SERVER_API_LINK_PARAM_TEXT + '=' + text;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getDatasetRDF(datasetName: string) {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_DATASETS_RDF 
						+ '/' + datasetName;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}

	public trackingDataset(datasetName: string){
		var headers = new Headers();
		headers.append('Content-Type', ' application/json');
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_TRACKING;
		return this.http.post(fullUrl, JSON.stringify({ user_key: this.currentUserKey, url: '/dataset/' + datasetName }), { headers: headers }).pipe(map(res => {
			let status = res.status;
			if(status == 200){
				return true;
			} else{
				return false;
			}
		}));
	}
}