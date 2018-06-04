import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Constants } from '../../app.constants';
import { StaticContent } from '../../models/StaticContent';

@Injectable()
export class StaticContentAdminService {

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

	private buildRequestHeadersforFormData() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return headers;
	}

	public getStaticContentBySectionName(sectionName: String){
		var auxUrl = "";
		if (sectionName == 'open-data' || sectionName == 'apps'
		|| sectionName == 'events'){
			auxUrl = Constants.SERVER_API_LINK_STATIC_CONTENT_INFO;
		}else {
			auxUrl = Constants.SERVER_API_LINK_STATIC_CONTENT_TOOLS;
		}
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + auxUrl + '/' + sectionName;
		let requestBodyParams: any = sectionName;
		return this.http.get(fullUrl, JSON.stringify(requestBodyParams)).map(res => res.json());
	}

	public setStaticContent(sectionName: String, updatedContent: StaticContent) {
		var auxUrl = "";
		if (sectionName == 'open-data' || sectionName == 'apps'
		|| sectionName == 'events'){
			auxUrl = Constants.SERVER_API_LINK_ADMIN_STATIC_CONTENT_INFO;
		}else {
			auxUrl = Constants.SERVER_API_LINK_ADMIN_STATIC_CONTENT_TOOLS;
		}
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + auxUrl;
		let headers = this.buildRequestHeaders();
		let requestBodyParams: any = updatedContent;
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), {headers: headers}).map(res => res.json());
	}

}
