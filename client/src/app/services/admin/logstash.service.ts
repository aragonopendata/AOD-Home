import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Constants } from '../../app.constants';
import { map } from 'rxjs/operators';

@Injectable()
export class LogstashService {
	currentUser: any;

	constructor(private http: Http) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	private createAuthorizationHeader(headers: Headers) {
		headers.append('Authorization', this.currentUser.token + ':' + this.currentUser.key);
		headers.append('Content-Type', 'application/json');
	}

	public getFilesAdmin() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let options = new RequestOptions({ headers: headers });
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_LOGSTASH;
		return this.http.get(fullUrl, options).pipe(map((res: Response) => {
			return res.json();
		}));
	}

	public saveLogstash(logstash: any) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_LOGSTASH;
		return this.http.post(fullUrl, logstash, { headers: headers }).pipe(map(res => res.json()));
	}

	public updateLogstash(logstash: any) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_LOGSTASH + "/" + logstash.id_logstash;
		return this.http.put(fullUrl, JSON.stringify(logstash), { headers: headers }).pipe(map(res => res.json()));
	}

	public deleteLogstash(logstash: any) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_LOGSTASH + "/" + logstash.id_logstash;
		return this.http.delete(fullUrl, { headers: headers }).pipe(map(res => res.json()));
	}

	public enableLogstash(id) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let options = new RequestOptions({ headers: headers });
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_LOGSTASH + "/" + id + "/enable";
		return this.http.get(fullUrl, options).pipe(map((res: Response) => {
			return res.json();
		}));
	}

	public disableLogstash(id) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let options = new RequestOptions({ headers: headers });
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_LOGSTASH + "/" + id + "/disable";
		return this.http.get(fullUrl, options).pipe(map((res: Response) => {
			return res.json();
		}));
	}

	public reloadLogstash(id: any, from: any, to: any) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_LOGSTASH + "/" + id + "/reload";
		return this.http.post(fullUrl, {from: from, to: to}, { headers: headers }).pipe(map(res => res.json()));
	}
}
