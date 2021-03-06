import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Constants } from '../../app.constants';
import { map } from 'rxjs/operators';

@Injectable()
export class AnalyticsService {

    constructor(private http: Http) { }

    public getFiles() {
        let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_WEB_ANALYTICS;
        return this.http.get(fullUrl).pipe(map((res: Response) => res.json()));
    }
}