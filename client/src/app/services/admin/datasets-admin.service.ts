import { Injectable } from '@angular/core';
import { Dataset } from '../../models/Dataset';
import { Http, Response, URLSearchParams, RequestOptions, Headers} from '@angular/http';
import { Constants } from 'app/app.constants';

@Injectable()
export class DatasetsAdminService {
	private dataset: Dataset;

	constructor(private http: Http) { }

	setDataset(dataset: Dataset) {
		this.dataset = dataset;
	}

	getDataset() {
		return this.dataset;
	}

	public getDatasetByName(datasetName: string) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_DATASETS 
						+ '/' + datasetName;
		return this.http.get(fullUrl).map(res => res.json());
	}

	public getDatasets(sort: string, page: number, rows: number, orgs: string) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_DATASETS 
						+ '?' + Constants.SERVER_API_LINK_PARAM_SORT + '=' + sort 
						+ '&' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page.toString()
						+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows.toString()
						+ '&' + Constants.SERVER_API_LINK_PARAM_ORGS + '=' + orgs
		return this.http.get(fullUrl).map(res => res.json());
	}

	public getDatasetsByText(sort: string, page: number, rows: number, text: string) {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_DATASETS 
						+ '?' + Constants.SERVER_API_LINK_PARAM_SORT + '=' + sort 
						+ '&' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page.toString() 
						+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows.toString()
						+ '&' + Constants.SERVER_API_LINK_PARAM_TEXT + '=' + text;
		return this.http.get(fullUrl).map(res => res.json());
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
		return this.http.get(fullUrl).map(res => res.json());
	}

	public removeDataset(dataset_name: string, user_name:string, user_id: number) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_DATASET_CUD_OPERATIONS;
		let requestBodyParams = {
			requestUserId: user_id,
			requestUserName: user_name,
			name: dataset_name
		};
        let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
		let options = new RequestOptions({ headers: headers, body: JSON.stringify(requestBodyParams)}); // Create a request option
		return this.http.delete(fullUrl, options).map((res:Response) => res.json());
	}

	public createDataset(newDataset: any) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_DATASET_CUD_OPERATIONS;
		let requestBodyParams: any = newDataset;
		return this.http.post(fullUrl, JSON.stringify(requestBodyParams), {headers: headers}).map(res => res.json());
	}
	
	public updateDataset(updatedDataset: any) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_DATASET_CUD_OPERATIONS;
		let requestBodyParams: any = updatedDataset;
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), {headers: headers}).map(res => res.json());
	}

	
}
