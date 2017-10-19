import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { TopicsService } from '../../../../services/web/topics.service';
import { Topic } from '../../../../models/Topic';
import { Constants } from '../../../../app.constants';

@Component({
	selector: 'app-topics-list',
	templateUrl: './topics-list.component.html',
	styleUrls: ['./topics-list.component.css']
})
export class TopicsListComponent implements OnInit {

	topics: Topic[];
	topic: Topic;
	hovers: any[] = [];
	
	//Dynamic URL build parameters
	routerLinkDataTopics: string;
	assetsUrl: string;
	routerLinkFacebookShare: string;
	routerLinkTwitterShare: string;
	routerLinkGooglePlusShare: string;
	aodMail: string;
	
	//Error Params
    errorTitle: string;
    errorMessage: string;

	constructor(private topicsService: TopicsService) {
		this.topics = [];
		this.routerLinkDataTopics = Constants.ROUTER_LINK_DATA_CATALOG_TOPICS;
		this.assetsUrl = Constants.AOD_ASSETS_BASE_URL;
		this.routerLinkFacebookShare = Constants.SHARE_FACEBOOK + window.location.href;
		this.routerLinkTwitterShare = Constants.SHARE_TWITTER + window.location.href;
		this.routerLinkGooglePlusShare = Constants.SHARE_GOOGLE_PLUS + window.location.href;
		this.aodMail = Constants.AOD_MAIL;
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
			try {
				this.topics = JSON.parse(topics).result;
				this.setHovers();
			} catch (error) {
				console.error("Error: getTopics() - topics-list.component.ts");
				this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Temas, vuelva a intentarlo y si el error persiste contacte con el administrador.";
			}
		});
	}
}
