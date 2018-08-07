import { Injectable } from '@angular/core';
import { Constants } from '../../app.constants';
import { Http, RequestOptions } from '@angular/http';
import { Header } from 'primeng/primeng';

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
			console.log(authorizationHeaderValue);
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

 	public getEvents(){
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + '/' + Constants.ROUTER_LINK_CAMPUS_ADMIN_EVENTS;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, JSON.stringify(headers)).map(res => res.json());
	}

}