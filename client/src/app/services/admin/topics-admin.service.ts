import { Injectable } from '@angular/core';
import { Topic } from '../../models/Topic';

@Injectable()
export class TopicsAdminService {
	private topic: Topic;
	private topics: Topic[];
	topic1: Topic = new Topic();
	topic2: Topic;
	topic3: Topic;
	topic4: Topic;
	topic5: Topic;
	topic6: Topic;
	topic7: Topic;
	topic8: Topic;
	topic9: Topic;

	constructor() {
		this.topics = [];
		this.topic1.id = '1';
		this.topic1.name = 'Ciencia y tecnología';
		this.topic1.image_url = '01-Ciencia';
		this.topics.push(this.topic1);

		this.topic1.id = '2';
		this.topic1.name = 'Comercio';
		this.topic1.image_url = '02-Comercio';
		this.topics.push(this.topic1);

		this.topic1.id = '3';
		this.topic1.name = 'Cultura y ocio';
		this.topic1.image_url = '03-Cultura';
		this.topics.push(this.topic1);

		this.topic1.id = '4';
		this.topic1.name = 'Demografía';
		this.topic1.image_url = '04-Demografia';
		this.topics.push(this.topic1);

		this.topic1.id = '5';
		this.topic1.name = 'Deporte';
		this.topic1.image_url = '05-Deporte';
		this.topics.push(this.topic1);

		this.topic1.id = '6';
		this.topic1.name = 'Economía';
		this.topic1.image_url = '06-Economia';
		this.topics.push(this.topic1);

		this.topic1.id = '7';
		this.topic1.name = 'Educación';
		this.topic1.image_url = '07-Educacion';
		this.topics.push(this.topic1);

		this.topic1.id = '8';
		this.topic1.name = 'Empleo';
		this.topic1.image_url = '08-Empleo';
		this.topics.push(this.topic1);

		this.topic1.id = '9';
		this.topic1.name = 'Energía';
		this.topic1.image_url = '09-Energia';
		this.topics.push(this.topic1);
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
