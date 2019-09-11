import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Constants } from '../../app.constants';

@Injectable()
export class AuthenticationService {

	public token: string;
	public currentUser: any;

	constructor(private http: Http) {
		this.setCurrentUser();
	}

	login(username: string, password: string): Observable<boolean> {
		var headers = new Headers();
		headers.append('Content-Type', ' application/json');
		let fullUrl = window["config"]["AOD_API_SECURITY_BASE_URL"] + Constants.SERVER_API_LINK_AUTHENTICATE;
		return this.http.post(fullUrl, JSON.stringify({ username: username, password: password }), { headers: headers }).pipe(map(res => {
			// login successful if there's a jwt token in the response
			let userToken = res.json() && res.json().token;
			let userId = res.json() && res.json().id;
			let userName = res.json() && res.json().name;
			let fullName = res.json() && res.json().fullname;
			let userRol = res.json() && res.json().rol;
			let userKey = res.json() && res.json().key;
			if (userToken) {
				// set token property
				this.token = userToken;
				// store username and jwt token in local storage to keep user logged in between page refreshes
				localStorage.setItem('currentUser', JSON.stringify({ id: userId, username: userName, fullname: fullName, token: userToken, rol: userRol, key: userKey }));
				this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
				// return true to indicate successful login
				return true;
			} else {
				// return false to indicate failed login
				return false;
			}
		}));
	}

	logout(): void {
		// clear token remove user from local storage to log user out
		this.token = null;
		localStorage.removeItem('currentUser');
	}

	setCurrentUser(){
		// set token if saved in local storage
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.token = this.currentUser && this.currentUser.token;
	}

	getCurrentUser(){
		return this.currentUser;
	}
}
