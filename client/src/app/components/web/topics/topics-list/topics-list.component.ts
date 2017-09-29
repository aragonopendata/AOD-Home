import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { TopicsService } from '../../../../services/web/topics.service';
import { Topic } from '../../../../models/Topic';

@Component({
	selector: 'app-topics-list',
	templateUrl: './topics-list.component.html',
	styleUrls: ['./topics-list.component.css']
})
export class TopicsListComponent implements OnInit {

	topics: Topic[];
	topic: Topic;
	hovers: any[] = [];

	constructor(private topicsService: TopicsService) {
		this.topics = [];
	}

	ngOnInit() {
		this.getTopics();
	}

	setHovers() {
		for (let top of this.topics) {
			this.hovers.push({ label: top.title, hover: false });
		}
	}

	setHover(name, index) {
		for (let hover of this.hovers) {
			if (hover.label === name) {
				hover.hover = !hover.hover;
			}
		}
	}

	unsetHover(name, index) {
		for (let hover of this.hovers) {
			if (hover.label === name) {
				hover.hover = !hover.hover;
			}
		}
	}

	setTopic(topic) {
		this.topicsService.setTopic(topic);
	}

	getTopics(): void {
		this.topicsService.getTopics().subscribe(topics => {
			this.topics = JSON.parse(topics).result;
			this.setHovers();
		});
	}
}
