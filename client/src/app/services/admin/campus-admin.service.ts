import { Injectable } from '@angular/core';
import { Constants } from '../../app.constants';
import { Http, Headers } from '@angular/http';

@Injectable()
export class CampusAdminService {
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

	public getEvents() {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_EVENTS;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public getContentsEvents(id) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_ENTRIES_BY_EVENT + '/' + id;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public getSites() {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_SITES;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public updateEvent(event, site_id) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_EVENTS;
		let headers = this.buildRequestHeaders();
		event['site_id'] = site_id;
		console.log(event);
		let requestBodyParams: any = event;
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).map(res => res.json());
	}

	public insertNewEvent(event, site_id) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_EVENTS;
		let headers = this.buildRequestHeaders();
		event['site_id'] = site_id;
		let requestBodyParams: any = event;
		return this.http.post(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).map(res => res.json());
	}

	public getEntries() {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_ENTRIES;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public getEntry(id) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_ENTRIES + '/' + id;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}
	
	public getSpeakers() {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_SPEAKERS;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

}