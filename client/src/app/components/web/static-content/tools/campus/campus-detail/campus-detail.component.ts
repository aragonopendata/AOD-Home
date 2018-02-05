import { Topic } from './../../../../../../models/campus/Topic';
import { Speaker } from './../../../../../../models/campus/Speaker';
import { Event } from './../../../../../../models/campus/Event';
import { Content } from './../../../../../../models/campus/Content';
import { ActivatedRoute } from '@angular/router';
import { Constants } from './../../../../../../app.constants';
import { CampusService } from './../../../../../../services/web/campus.service';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-campus-detail',
  templateUrl: './campus-detail.component.html',
  styleUrls: ['./campus-detail.component.css']
})
export class CampusDetailComponent implements OnInit {

  content: Content = new Content();
  event: Event = new Event();
  speakers: Speaker[];
  topics: Topic[];

  contentPlatformAragonOpenData: string;
  contentPlatformBostOcksOrg: string;
  contentPlatformGitHub: string;
  contentPlatformPodcast: string;
  contentPlatformSlideShare: string;
  contentPlatformVimeo: string;
  contentPlatformYoutube: string;
  contentPlatformLink: string;
  contentAssetsBaseURL: string;

  errorTitle: string;
  errorMessage: string;
  campusErrorTitle: string;
  campusErrorMessage: string;

  constructor(private campusService: CampusService, private activatedRoute: ActivatedRoute, public sanitizer: DomSanitizer) {
    this.campusErrorTitle = Constants.CAMPUS_EVENTS_ERROR_TITLE;
    this.campusErrorMessage = Constants.CAMPUS_EVENTS_ERROR_MESSAGE;
    this.contentPlatformAragonOpenData = Constants.CAMPUS_CONTENT_PLATFORM_ARAGONOPENDATA;
    this.contentPlatformBostOcksOrg = Constants.CAMPUS_CONTENT_PLATFORM_BOSTOCKSORG;
    this.contentPlatformGitHub = Constants.CAMPUS_CONTENT_PLATFORM_GITHUB;
    this.contentPlatformPodcast = Constants.CAMPUS_CONTENT_PLATFORM_PODCAST;
    this.contentPlatformSlideShare = Constants.CAMPUS_CONTENT_PLATFORM_SLIDESHARE;
    this.contentPlatformVimeo = Constants.CAMPUS_CONTENT_PLATFORM_VIMEO;
    this.contentPlatformYoutube = Constants.CAMPUS_CONTENT_PLATFORM_YOUTUBE;
    this.contentPlatformLink = Constants.CAMPUS_CONTENT_PLATFORM_LINK;
    this.contentAssetsBaseURL = Constants.AOD_ASSETS_BASE_URL;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
			try {
        this.content.id =  params[Constants.ROUTER_LINK_TOOLS_CAMPUS_EVENT_NAME];
			} catch (error) {
				console.error("Error: ngOnInit() params - campus-detail.component.ts");
				this.errorTitle = this.campusErrorTitle;
        this.errorMessage = this.campusErrorMessage;
			}
    });
    if(this.content.id){
			this.loadContent(this.content);
		}
  }
  initializeDataset() {
		this.content = new Content();
	}
	
	loadContent(content: Content) {
		this.initializeDataset();
		this.campusService.getCampusContentByID(content.id).subscribe(contentResult => {
			try {
        this.content = contentResult[0];
        this.loadSpeakers(this.content.id);
        this.loadTopics(this.content.id);
        this.loadEvent(this.content.event_id);

			} catch (error) {
				console.error("Error: loadContent() - campus-detail.component.ts");
				this.errorTitle = this.campusErrorTitle;
        this.errorMessage = this.campusErrorMessage;
			}
		});
  }
  
  loadEvent(event_id: number) {
    this.campusService.getCampusEventByID(event_id).subscribe(eventResult => {
      try {
        this.event = eventResult[0];
			} catch (error) {
				console.error("Error: loadEvent() - campus-detail.component.ts");
				this.errorTitle = this.campusErrorTitle;
        this.errorMessage = this.campusErrorMessage;
			}
    });
  }

  loadSpeakers(content_id: number){
    this.campusService.getCampusSpeakersByContentID(content_id).subscribe(speakerResult => {
      try {
        this.speakers = speakerResult;
			} catch (error) {
				console.error("Error: loadSpeakers() - campus-detail.component.ts");
				this.errorTitle = this.campusErrorTitle;
        this.errorMessage = this.campusErrorMessage;
			}
    });
  }

  loadTopics(content_id: number){
    this.campusService.getCampusTopicsByContentID(content_id).subscribe(topicResult => {
      try {
        this.topics = topicResult;
			} catch (error) {
				console.error("Error: loadTopics() - campus-detail.component.ts");
				this.errorTitle = this.campusErrorTitle;
        this.errorMessage = this.campusErrorMessage;
			}
    });
  }

}
