import 'rxjs/add/operator/map'
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Constants } from '../../app.constants';

@Injectable()
export class AuthenticationService {

	public token: string;

	constructor(private http: Http) {
		// set token if saved in local storage
		var currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.token = currentUser && currentUser.token;
	}

	login(username: string, password: string): Observable<boolean> {
		var headers = new Headers();
		headers.append('Content-Type', ' application/json');
		let fullUrl = Constants.AOD_API_SECURITY_BASE_URL + Constants.SERVER_API_LINK_AUTHENTICATE;
		return this.http.post(fullUrl, JSON.stringify({ username: username, password: password }), { headers: headers }).map(res => {
			// login successful if there's a jwt token in the response
			let userToken = res.json() && res.json().token;
			let userId = res.json() && res.json().id;
			let userName = res.json() && res.json().name;
			let fullName = res.json() && res.json().fullname;
			let userRol = res.json() && res.json().rol;
			if (userToken) {
				// set token property
				this.token = userToken;
				// store username and jwt token in local storage to keep user logged in between page refreshes
				localStorage.setItem('currentUser', JSON.stringify({ id: userId, username: userName, fullname: fullName, token: userToken, rol: userRol }));
				// return true to indicate successful login
				return true;
			} else {
				// return false to indicate failed login
				return false;
			}
		});
	}

	logout(): void {
		// clear token remove user from local storage to log user out
		this.token = null;
		localStorage.removeItem('currentUser');
	}
}
