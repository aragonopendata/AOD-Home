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

	public getFiles() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let options = new RequestOptions({ headers: headers });
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_LOGSTASH_FILES;
		console.log(fullUrl);
		return this.http.get(fullUrl, options).pipe(map((res: Response) => res.json()));
	}

	public saveLogstash(logstash: any) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let options = new RequestOptions({ headers: headers });
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_LOGSTASH_INSERT;
		return this.http.post(fullUrl, JSON.stringify(logstash), { headers: headers }).pipe(map(res => res.json()));
	}

	public updateLogstash(logstash: any) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let options = new RequestOptions({ headers: headers });
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_LOGSTASH_INSERT + "/" + logstash.id_logstash;
		return this.http.put(fullUrl, JSON.stringify(logstash), { headers: headers }).pipe(map(res => res.json()));
	}

	public deleteLogstash(logstash: any) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let options = new RequestOptions({ headers: headers });
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_LOGSTASH_DELETE + "/" + logstash.id_logstash;
		return this.http.delete(fullUrl, { headers: headers }).pipe(map(res => res.json()));
	}

	public reloadLogstash() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		let options = new RequestOptions({ headers: headers });
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_LOGSTASH_RELOAD;
		return this.http.get(fullUrl, { headers: headers }).pipe(map(res => res.json()));
	}
}