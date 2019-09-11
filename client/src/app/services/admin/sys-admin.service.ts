import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants } from 'app/app.constants';

@Injectable({
    providedIn: 'root'
})
export class SysAdminService {

    currentUser: any;

    constructor(private http: Http) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    private createAuthorizationHeader(headers: Headers) {
        if (this.currentUser && this.currentUser.token && this.currentUser.key) {
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

    public getLogFileData() {
        let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_SYS;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).pipe(map(res => res.json()));
    }

    public getEmailRevision() {
        let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_SYS + '/emailRevision';
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).pipe(map(res => res.json()));
    }

    public changeEmailRevision(checked) {
        let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_SYS + '/emailRevision';
		let headers = this.buildRequestHeaders();
		let requestBodyParams: any = {
            "emailRevision": checked
        };
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).pipe(map(res => res.json()));
    }

}
