import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers} from '@angular/http';
import { Constants } from 'app/app.constants';
import { map } from 'rxjs/operators';

@Injectable()
export class AodCoreAdminService {
    currentUser: any;
    
    constructor(private http: Http) {
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

    public getViews(){
        let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_GA_OD_CORE + Constants.SERVER_API_LINK_GA_OD_CORE_VIEWS 
        let headers = this.buildRequestHeaders();
        return this.http.get(fullUrl, { headers: headers }).pipe(map(res => res.json()));
    }

}