import { Injectable } from '@angular/core';

import { History } from '../../models/History';
import { Http, Response, URLSearchParams, RequestOptions, Headers} from '@angular/http';
import { Constants } from 'app/app.constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FocusAdminService {

  private history: History;
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

	createJsonFromString(field, value) {
		let JSONElement: any = {};
		JSONElement[field] = value;
		return JSONElement;
	}

	public getHistories(sort: string, limit: number, page: number, text:string) {
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_FOCUS + Constants.SERVER_API_LINK_HISTORIES;
		let params = new URLSearchParams();
		params.append("sort", sort)
		params.append("page", page.toString())
		params.append("limit", limit.toString())
		params.append("text", text)

		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, {headers: headers, search: params  }).pipe(map((res:Response) => res.json()));
	}

	public hideHistory(id: string) {
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_FOCUS + Constants.SERVER_API_LINK_HISTORY;
		let headers = this.buildRequestHeaders();
		return this.http.delete(fullUrl+'/'+id, {headers: headers}).pipe(map(res => res.json()));
	}

	public returnToBorrador(history: History) {
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_FOCUS + Constants.SERVER_API_LINK_HISTORY_BORRADOR;
		let headers = this.buildRequestHeaders();
		let requestBodyParams: any = this.createJsonFromString('history', history);
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).map(res => res.json());;
	}

	public publishHistory(history: History) {
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_FOCUS + Constants.SERVER_API_LINK_HISTORY;
		let headers = this.buildRequestHeaders();
		let requestBodyParams: any = this.createJsonFromString('history', history);
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).map(res => res.json());;
	}

	public deleteHistory(id: string){
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_FOCUS + Constants.SERVER_API_LINK_HISTORY_DELETE;
		let headers = this.buildRequestHeaders();
		return this.http.delete(fullUrl+'/'+id, {headers: headers}).pipe(map(res => res.json()));
	}

	
	public sendPublicUserMail(history:History){
		const headers = new Headers();
		//let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_FOCUS + Constants.SERVER_API_LINK_HISTORY;
		let fullUrl= window["config"]["VISUAL_BACK_SERVER_URL"] + Constants.SEND_MAIL_PUBLIC_USER_HISTORY_PATH;
		headers.append('Content-Type', 'application/json');
		return this.http.post(fullUrl,history,{headers: headers}).map(res => JSON.parse(JSON.stringify(res)))
		  .catch(err => {
		  	console.log('hay eror:' + err)
			return Observable.throw('error envío correo');
		  });
		  
	}

	public sendReturnToBorradorUserMail(history:History){
		const headers = new Headers();
		let fullUrl= window["config"]["VISUAL_BACK_SERVER_URL"] + Constants.SEND_MAIL_RETURN_BORRADOR_USER_HISTORY_PATH;
		headers.append('Content-Type', 'application/json');
		return this.http.post(fullUrl,history,{headers: headers}).map(res => JSON.parse(JSON.stringify(res)))
		  .catch(err => {
		  	console.log('hay eror:' + err)
			return Observable.throw('error envío correo');
		  });
		  
	  }

}
