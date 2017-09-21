import { Injectable } from '@angular/core';
import { Topic } from '../../models/Topic';

@Injectable()
export class TopicsAdminService {
	private topic: Topic;
	private topics: Topic[];

	constructor() {
		this.topics = [
			new Topic('1', 'Ciencia y tecnología', '01-Ciencia', null, null, null),
			new Topic('2', 'Comercio', '02-Comercio', null, null, null),
			new Topic('3', 'Cultura y ocio', '03-Cultura', null, null, null),
			new Topic('4', 'Demografía', '04-Demografia', null, null, null),
			new Topic('5', 'Deporte', '05-Deporte', null, null, null),
			new Topic('6', 'Economía', '06-Economia', null, null, null),
			new Topic('7', 'Educación', '07-Educacion', null, null, null),
			new Topic('8', 'Empleo', '08-Empleo', null, null, null),
			new Topic('9', 'Energía', '09-Energia', null, null, null)
		];
	}

	getTopics() {
		return this.topics;
	}

	setTopic(topic: Topic) {
		this.topic = topic;
	}

	getTopic() {
		return this.topic;
	}

}
