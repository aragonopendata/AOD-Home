import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Constants } from '../../app.constants';

@Injectable()
export class AnalyticsService {

constructor(private http: Http) { }

public getFiles() {
    let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_WEB_ANALYTICS;
    return this.http.get(fullUrl).map((res:Response) => res.json());
}


}