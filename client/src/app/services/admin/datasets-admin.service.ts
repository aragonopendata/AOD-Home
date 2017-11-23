import { Injectable } from '@angular/core';
import { Dataset } from '../../models/Dataset';
import { Http, Response, URLSearchParams, RequestOptions, Headers} from '@angular/http';
import { Constants } from 'app/app.constants';

@Injectable()
export class DatasetsAdminService {
	private dataset: Dataset;
	currentUser: any;
	
	constructor(private http: Http) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	public getCurrentUser() {
		return this.currentUser;
	}

	private createAuthorizationHeader(headers: Headers) {
		if (this.currentUser && this.currentUser.token && this.currentUser.key) {
			//Authorization header: API_KEY:JWT_Token
			let authorizationHeaderValue = this.currentUser.token + ':' + this.currentUser.key;
			headers.append('Authorization', authorizationHeaderValue);
		}
	}

	private buildRequestHeaders() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		headers.append('Content-Type', ' application/json');
		return headers;
	}

	private buildRequestHeadersforFormData() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return headers;
	}

	setDataset(dataset: Dataset) {
		this.dataset = dataset;
	}

	getDataset() {
		return this.dataset;
	}

	public getDatasetByName(datasetName: string) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_DATASETS 
						+ '/' + datasetName;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public getDatasets(sort: string, page: number, rows: number, orgs: string) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_DATASETS 
						+ '?' + Constants.SERVER_API_LINK_PARAM_SORT + '=' + sort 
						+ '&' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page.toString()
						+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows.toString()
						+ '&' + Constants.SERVER_API_LINK_PARAM_ORGS + '=' + orgs
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public getDatasetsByText(sort: string, page: number, rows: number, text: string) {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_DATASETS 
						+ '?' + Constants.SERVER_API_LINK_PARAM_SORT + '=' + sort 
						+ '&' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page.toString() 
						+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows.toString()
						+ '&' + Constants.SERVER_API_LINK_PARAM_TEXT + '=' + text;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	addToCollection(dataset: Dataset) {
		/*if (this.datasets.indexOf(dataset) !== -1) {
		return;
		}
		this.datasets.push(dataset);*/
	}

	public getTags(query: string) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_TAGS;
		if (query) {
			fullUrl += '?q=' + query;
		}
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public removeDataset(dataset_name: string, user_name:string, user_id: number) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_DATASET_CUD_OPERATIONS;
		let requestBodyParams = {
			requestUserId: user_id,
			requestUserName: user_name,
			name: dataset_name
		};
		let headers = this.buildRequestHeaders();
		let options = new RequestOptions({ headers: headers, body: JSON.stringify(requestBodyParams)}); // Create a request option
		return this.http.delete(fullUrl, options).map((res:Response) => res.json());
	}

	public createDataset(newDataset: any) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_DATASET_CUD_OPERATIONS;
		let headers = this.buildRequestHeaders();
		let requestBodyParams: any = newDataset;
		return this.http.post(fullUrl, JSON.stringify(requestBodyParams), {headers: headers}).map(res => res.json());
	}
	
	public updateDataset(updatedDataset: any) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_DATASET_CUD_OPERATIONS;
		let headers = this.buildRequestHeaders();
		let requestBodyParams: any = updatedDataset;
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), {headers: headers}).map(res => res.json());
	}

	public createResource(file: any,newResource: any) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_RESOURCE_CUD_OPERATIONS;

		let formData:FormData = new FormData();  
		if (file != null) {
			formData.append('file', file, file.name);
		}
		if(newResource.url != undefined) {
			formData.append('url', newResource.url);	
		}

		if(newResource.view_id != undefined) {
			formData.append('view_id', newResource.view_id);
		}

		formData.append('package_id', newResource.package_id);
		formData.append('name', newResource.name);
		formData.append('format', newResource.format);
		formData.append('description', newResource.description);
		formData.append('resource_type', newResource.resource_type);
		let headers = this.buildRequestHeadersforFormData();
		let options = new RequestOptions({ headers: headers}); // Create a request option
		return this.http.post(fullUrl, formData, options).map((res:Response) => res.json());
	}

	public updateResource(updatedResource: any) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_RESOURCE_CUD_OPERATIONS;
		let headers = this.buildRequestHeaders();
		let requestBodyParams: any = updatedResource;
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), {headers: headers}).map(res => res.json());
	}

	public removeResource(resource_id: string) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_RESOURCE_CUD_OPERATIONS;
		let requestBodyParams = {
			id: resource_id
		};
        let headers = this.buildRequestHeaders();
		let options = new RequestOptions({ headers: headers, body: JSON.stringify(requestBodyParams)}); // Create a request option
		return this.http.delete(fullUrl, options).map((res:Response) => res.json());
	}
	
}
