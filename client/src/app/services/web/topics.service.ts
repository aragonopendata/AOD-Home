import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Topic } from '../../models/Topic';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Constants } from '../../app.constants';

@Injectable()
export class TopicsService {
	private topics: Observable<Topic[]>;
	private topic: Topic;

	constructor(private http: Http) { }

	public getTopics() {
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_TOPICS;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
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

