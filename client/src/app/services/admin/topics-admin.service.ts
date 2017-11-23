import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Topic } from '../../models/Topic';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Constants } from '../../app.constants';

@Injectable()
export class TopicsAdminService {
	private topics: Observable<Topic[]>;
	private topic: Topic;
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

	public getTopics() {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_TOPICS;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public getTopicByName(topicName: string) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_TOPICS 
						+ '/' + topicName;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public setTopic(topic: Topic) {
		this.topic = topic;
	}

	public getTopic() {
		return this.topic;
	}

	private handleError(error: Response) {
		return Observable.throw(error.json().error || 'Server error');
	}
}

