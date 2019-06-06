import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Constants } from '../../app.constants';
import { GlobalUtils } from '../../utils/GlobalUtils';
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

	public getSparqlGraphs() {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_STATIC_CONTENT_TOOLS 
						+ Constants.SERVER_API_LINK_STATIC_CONTENT_TOOLS_SPARQL_GRAPHS;
		return this.http.get(fullUrl).map(res => res.json());
	}

	public sendSparqlClient(formParms) {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_STATIC_CONTENT_TOOLS 
					+ Constants.SERVER_API_LINK_STATIC_CONTENT_TOOLS_SPARQL_CLIENT
					+ '?' + Constants.SERVER_API_LINK_SPARQL_CLIENT_PARAM_GRAPH + '=' + encodeURIComponent(formParms.graph)
					+ '&' + Constants.SERVER_API_LINK_SPARQL_CLIENT_PARAM_QUERY + '=' + encodeURIComponent(formParms.query)
					+ '&' + Constants.SERVER_API_LINK_SPARQL_CLIENT_PARAM_FORMAT + '=' + encodeURIComponent(formParms.format)
					+ '&' + Constants.SERVER_API_LINK_SPARQL_CLIENT_PARAM_TIMEOUT + '=' + encodeURIComponent(formParms.timeout)
					if(formParms.debug == true){
						+ '&' + Constants.SERVER_API_LINK_SPARQL_CLIENT_PARAM_DEBUG + '=on';
					}
							
		fullUrl = GlobalUtils.formatRequestSPARQL(fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}
}
