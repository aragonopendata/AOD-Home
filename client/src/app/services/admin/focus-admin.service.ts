import { Injectable } from '@angular/core';

import { History } from '../../models/History';
import { Http, Response, URLSearchParams, RequestOptions, Headers} from '@angular/http';
import { Constants } from 'app/app.constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FocusAdminService {

  private history: History;
  currentUser: any;

  constructor(private http: Http) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	public refreshUser() {
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
	public getHistories() {
		console.log('en get histories (service)')
			//this.refreshUser();
			let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_FOCUS + Constants.SERVER_API_LINK_HISTORIES
			let headers = this.buildRequestHeaders();
			return this.http.get(fullUrl, { headers: headers }).pipe(map(res => res.json()));
	  }
  /*public getHistories(sort: string, page: number, rows: number) {
    console.log('en get histories (service)')
		//this.refreshUser();
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_FOCUS + Constants.SERVER_API_LINK_HISTORIES
								+ '?' + Constants.SERVER_API_LINK_PARAM_SORT + '=' + sort 
								+ '&' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page.toString
								+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows.toString
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).pipe(map(res => res.json()));
  }*/
}
