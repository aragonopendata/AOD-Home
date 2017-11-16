import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
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
		requestBodyParams.role = newUser.role[0].id;
		requestBodyParams.requestUserId = this.currentUser && this.currentUser.id;
		requestBodyParams.requestUserName = this.currentUser && this.currentUser.username;
		return this.http.post(fullUrl, JSON.stringify(requestBodyParams), {headers: headers}).map(res => res.json());
	}

	public getOrganitationsByCurrentUser(){
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_USER_ORGANIZATIONS_START + this.currentUser.id
		+ Constants.SERVER_API_LINK_ADMIN_USER_ORGANIZATIONS_END;
		return this.http.get(fullUrl).map(res => res.json());
	}

	public removeUser(user: User, requestUserId: string, requestUserName: string) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_USER_CUD_OPERATIONS;
		let requestBodyParams = {
			requestUserId: requestUserId,
			requestUserName: requestUserName,
			userIdDb: user.id,
			userNameCkan: user.name
		};
        let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
		let options = new RequestOptions({ headers: headers, body: JSON.stringify(requestBodyParams)}); // Create a request option
		return this.http.delete(fullUrl, options).map((res:Response) => res.json());
	}

	public updateUser(updatedUser: any) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_USER_CUD_OPERATIONS;
		let requestBodyParams: any = updatedUser;
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), {headers: headers}).map(res => res.json());
	}
}