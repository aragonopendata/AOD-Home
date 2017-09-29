import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Topic } from '../../models/Topic';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Constants } from '../../app.constants';

@Injectable()
export class TopicsService {
	private topics: Observable<Topic[]>;
	private topic: Topic;

	constructor(private http: Http) { }

	public getTopics() {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_TOPICS;
		return this.http.get(fullUrl).map(res => res.json());
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

