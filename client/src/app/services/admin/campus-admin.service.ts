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

	public getTopics() {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_TOPICS;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public updateEvent(event, site_id) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_EVENTS;
		let headers = this.buildRequestHeaders();
		event['site_id'] = site_id;
		this.formatDate(event);
		let requestBodyParams: any = event;
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).map(res => res.json());
	}

	public insertNewEvent(event, site_id) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_EVENTS;
		let headers = this.buildRequestHeaders();
		event['site_id'] = site_id;
		this.formatDate(event);
		let requestBodyParams: any = event;
		return this.http.post(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).map(res => res.json());
	}

	formatDate(event){
		let eventDate = new Date(event.date);
		let day = eventDate.getDate();
		let month = eventDate.getMonth() + 1;
		let year = eventDate.getFullYear();
		event.date = year + '-' + month + '-' + day;
	}

	public getEntries() {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_ENTRIES;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public getEntriesByEvent(idEvent) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_ENTRIES_BY_EVENT + '/' + idEvent;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public getEntriesBySpeaker(idSpeaker) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_ENTRIES_BY_SPEAKER + '/' + idSpeaker;
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

	public getFormats() {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_FORMATS;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public getTypes() {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_TYPES;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public getPlatforms() {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_PLATFORMS;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public insertNewSite(site) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_SITES;
		let headers = this.buildRequestHeaders();
		let requestBodyParams: any = this.createJsonFromString('name', site);
		return this.http.post(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).map(res => res.json());
	}

	public insertNewSpeaker(speaker) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_SPEAKERS;
		let headers = this.buildRequestHeaders();
		let requestBodyParams: any = speaker;
		return this.http.post(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).map(res => res.json());
	}

	public updateSpeaker(speaker) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_SPEAKERS;
		let headers = this.buildRequestHeaders();
		let requestBodyParams: any = speaker;
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).map(res => res.json());
	}

	createJsonFromString(field, value) {
		let JSONElement: any = {};
		JSONElement[field] = value;
		return JSONElement;
	}

	public insertNewEntry(entry, id_topics) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_ENTRIES;
		let headers = this.buildRequestHeaders();
		entry['id_topics'] = id_topics;
		let requestBodyParams: any = entry;
		return this.http.post(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).map(res => res.json());
	}

	public updateEntry(entry, topicStatus) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_ENTRIES;
		let headers = this.buildRequestHeaders();
		entry['topicStatus'] = topicStatus;
		let requestBodyParams: any = entry;
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).map(res => res.json());
	}

}