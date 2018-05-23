import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Constants } from '../../app.constants';
import { map } from 'rxjs/operators';

@Injectable()
export class CampusService {

	constructor(private http: Http) { }

	public getCampusEvents(page: number, rows: number, type: number, textSearch: string) {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_CAMPUS_EVENTS
						+ '?' + Constants.SERVER_API_LINK_PARAM_PAGE + '=' + page
						+ '&' + Constants.SERVER_API_LINK_PARAM_ROWS + '=' + rows;
						if(type){
							fullUrl += '&' + Constants.SERVER_API_LINK_PARAM_TYPE + '=' + type;
						}
						if(textSearch){
							fullUrl += '&' + Constants.SERVER_API_LINK_PARAM_TEXT + '=' + textSearch;
						}
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getCampusContents(event_id: number) {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_CAMPUS_CONTENTS
		+ '?id=' + event_id ;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getCampusTypes() {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_CAMPUS_TYPES;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getCampusContentByID(content_id: number) {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_URL_CAMPUS_CONTENT 
		+ '/' + content_id;
	return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getCampusEventByID(event_id: number) {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_CAMPUS_EVENT 
		+ '/' + event_id;
	return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getCampusTopicsByContentID(content_id: number) {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_CAMPUS_TOPICS 
		+ '/' + content_id;
	return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getCampusSpeakersByContentID(content_id: number) {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_CAMPUS_SPEAKERS 
		+ '/' + content_id;
	return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	

}
