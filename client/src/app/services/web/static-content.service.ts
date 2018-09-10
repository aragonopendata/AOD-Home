import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Constants } from '../../app.constants';
import { map } from 'rxjs/operators';

@Injectable()
export class StaticContentService {
	
	constructor(private http: Http) { }

	public getOpenDataInfoStaticContent() {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_STATIC_CONTENT_INFO 
						+ Constants.SERVER_API_LINK_STATIC_CONTENT_INFO_OPEN_DATA;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getOpenDataInfoKnowledgeStaticContent() {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_STATIC_CONTENT_INFO 
						+ Constants.SERVER_API_LINK_STATIC_CONTENT_INFO_CONOCIMIENTO;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getOpenDataInfoStaticContentById(id) {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_STATIC_CONTENT_INFO 
						+ Constants.SERVER_API_LINK_STATIC_CONTENT_INFO_OPEN_DATA + '/' + id;
		return this.http.get(fullUrl).map(res => res.json());
	}

	public getOpenDataInfoTermsStaticContent() {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_STATIC_CONTENT_INFO 
						+ Constants.SERVER_API_LINK_STATIC_CONTENT_INFO_OPEN_DATA + '/terms';
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getApplicationsInfoStaticContent() {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_STATIC_CONTENT_INFO 
						+ Constants.SERVER_API_LINK_STATIC_CONTENT_INFO_APPLICATIONS;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getEventsInfoStaticContent() {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_STATIC_CONTENT_INFO 
						+ Constants.SERVER_API_LINK_STATIC_CONTENT_INFO_EVENTS;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getDevelopersToolsStaticContent() {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_STATIC_CONTENT_TOOLS 
						+ Constants.SERVER_API_LINK_STATIC_CONTENT_TOOLS_DEVELOPERS;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getApisToolsStaticContent() {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_STATIC_CONTENT_TOOLS 
						+ Constants.SERVER_API_LINK_STATIC_CONTENT_TOOLS_APIS;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}
}
