import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants } from '../../app.constants';
import { User } from '../../models/User';

@Injectable()
export class UsersAdminService {
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

	public getUsers(sort: string, page: number, rows: number) {
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_USERS
			+ '?' + Constants.SERVER_API_LINK_PARAM_SORT + '=' + sort
			+ '&' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page.toString()
			+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows.toString();
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).pipe(map(res => res.json()));
	}

	public getUser(userId: number) {
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"]  + Constants.SERVER_API_LINK_ADMIN_USERS 
			+ '/' + userId;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers:  headers }).pipe(map(res  =>  res.json()));
	}

	public getOrganizationsByCurrentUser() {
		this.refreshUser();
		if (this.currentUser != undefined){
			let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_USERS 
			+ '/' + this.currentUser.id + Constants.SERVER_API_LINK_ADMIN_USER_ORGANIZATIONS;
			let headers = this.buildRequestHeaders();
			return this.http.get(fullUrl, { headers: headers }).pipe(map(res => res.json()));
		}
	}

	public getOrganizationsForUserByID( user: any ) {
		this.refreshUser();
		if (this.currentUser != undefined){
			let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_USERS 
			+ '/' + user.id + Constants.SERVER_API_LINK_ADMIN_USER_ORGANIZATIONS;
			let headers = this.buildRequestHeaders();
			let requestBodyParams: any = user;
			return this.http.post(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).pipe(map(res => res.json()));
		}
	}

	public createUser(user: any) {
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_USERS;
		let requestBodyParams = user;
		requestBodyParams.role = user.role[0].id;
		let headers = this.buildRequestHeaders();
		return this.http.post(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).pipe(map(res => res.json()));
	}

	public updateUser(user: User) {
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_USERS
			+ '/' + user.id;
		let headers = this.buildRequestHeaders();
		let requestBodyParams: any = user;
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).pipe(map(res => res.json()));
	}

	public removeUser(user: User) {
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_USERS+ '/' + user.id;
		let requestBodyParams = {
			userNameCkan: user.name
		};
        let headers = this.buildRequestHeaders();
		let options = new RequestOptions({ headers: headers, body: JSON.stringify(requestBodyParams)});
		return this.http.delete(fullUrl, options).pipe(map((res:Response) => res.json()));
	}
}