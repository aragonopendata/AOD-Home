import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Constants } from '../../app.constants';
import { map } from 'rxjs/operators';
import { Role } from 'app/models/Role';

@Injectable()
export class RolesAdminService {
	currentUser: any;

	constructor(private http: Http) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	private createAuthorizationHeader(headers: Headers) {
		headers.append('Authorization', this.currentUser && this.currentUser.token);
	}

	private buildRequestHeaders() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		headers.append('Content-Type', ' application/json');
		return headers;
	}

	public getRole(roleId: number) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let options = new RequestOptions({ headers: headers });
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_GET_ROLE
						+ '/' + roleId;
		return this.http.get(fullUrl, options).pipe(map(res => res.json()));
	}

	public getRoles() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let options = new RequestOptions({ headers: headers });
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_ROLES_LIST;
		return this.http.get(fullUrl, options).pipe(map(res => res.json()));
	}

	public getUsersOfRole(roleId: number) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let options = new RequestOptions({ headers: headers });
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_ROLES_LIST + '/usersRole/' + roleId;
		return this.http.get(fullUrl, options).pipe(map(res => res.json()));
	}

	public createRole(role: any) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_ROLES_LIST;
		let requestBodyParams = role;
		let headers = this.buildRequestHeaders();
		return this.http.post(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).pipe(map(res => res.json()));
	}

	public updateRole(role: Role) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_ROLES_LIST
			+ '/' + role.id;
		let headers = this.buildRequestHeaders();
		let requestBodyParams: any = role;
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).pipe(map(res => res.json()));
	}

	public removeRole(role: Role) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_ROLES_LIST + '/' + role.id;
		let requestBodyParams: any = role;
        let headers = this.buildRequestHeaders();
		let options = new RequestOptions({ headers: headers, body: JSON.stringify(requestBodyParams)});
		return this.http.delete(fullUrl, options).pipe(map(res => res.json()));
	}
}