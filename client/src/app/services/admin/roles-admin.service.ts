import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Constants } from '../../app.constants';

@Injectable()
export class RolesAdminService {
	currentUser: any;

	constructor(private http: Http) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	private createAuthorizationHeader(headers: Headers) {
		headers.append('Authorization', this.currentUser && this.currentUser.token);
	}

	public getRoles() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let options = new RequestOptions({ headers: headers });
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_ROLES_LIST;
		return this.http.get(fullUrl, options).map(res => res.json());
	}
}