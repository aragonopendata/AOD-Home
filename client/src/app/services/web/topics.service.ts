import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Topic } from '../../models/Topic';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { ConstantsService } from '../../app.constants';

@Injectable()
export class TopicsService {
	private topics: Observable<Topic[]>;
	private topic: Topic;
	private baseUrl: String;

	/**
	 * Topics service class constructor.
	 * @param http - Http module.
	 * @param constants - Constants class.
	 */
	constructor(private http: Http, private constants: ConstantsService) {
		this.baseUrl = this.constants.AOD_API_WEB_BASE_URL;
	}

	/**
	 * Gets a list of existing topics.
	 */
	public getTopics() {
		return this.http.get(this.baseUrl + '/topics').map(res => res.json());
	}

	/**
	 * Sets a topic.
	 * @param topic - Topic to set.
	 */
	public setTopic(topic: Topic) {
		this.topic = topic;
	}

	/**
	 * Gets a topic.
	 */
	public getTopic() {
		return this.topic;
	}

	/**
	 * Handles any error thrown.
	 * @param error - Error handled.
	 */
	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}
}

