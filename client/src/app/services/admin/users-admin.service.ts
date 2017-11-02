import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers } from '@angular/http';
import { Constants } from '../../app.constants';
import { User } from '../../models/User';

@Injectable()
export class UsersAdminService {
	currentUser: any;
	
	constructor(private http: Http) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	private createAuthorizationHeader(headers: Headers) {
		headers.append('Authorization', this.currentUser && this.currentUser.token);
	}

	public getUsers(sort: string, page: number, rows: number) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_USERS_LIST
						+ '?' + Constants.SERVER_API_LINK_PARAM_SORT + '=' + sort 
						+ '&' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page.toString() 
						+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows.toString();
		return this.http.get(fullUrl, {headers: headers}).map(res => res.json());
	}

	public createUser(newUser: User) {
		let headers = new Headers();
		headers.append('Content-Type', ' application/json');
		this.createAuthorizationHeader(headers);
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_USER_CUD_OPERATIONS;
		let requestBodyParams: any = newUser;
		requestBodyParams.requestUserId = this.currentUser && this.currentUser.id;
		requestBodyParams.requestUserName = this.currentUser && this.currentUser.username;
		return this.http.post(fullUrl, JSON.stringify(requestBodyParams), {headers: headers}).map(res => res.json());
	}
}