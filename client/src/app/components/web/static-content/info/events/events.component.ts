import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { StaticContent } from '../../../../../models/StaticContent';
import { StaticContentService } from '../../../../../services/web/static-content.service';
import { Router, ActivatedRoute } from '@angular/router';
import $ from 'jquery';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

    index: number = 0;
    contents: StaticContent[];
    sectionTitle: string;
    sectionSubtitle: string;
    sectionDescription: string;
    targetUrl: string;
    url: string = null;

    constructor(private staticContentService: StaticContentService, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.getStaticContentInfo();
    }

    getUrlFragment() {
        this.activatedRoute.fragment.subscribe(fragment => {
            this.targetUrl = fragment;
		});
    }

    getStaticContentInfo() {
        this.staticContentService.getEventsInfoStaticContent().subscribe(staticContent => {
            this.contents = staticContent;
            this.sectionTitle = this.contents[0].sectionTitle;
            this.sectionSubtitle = this.contents[0].sectionSubtitle;
            this.sectionDescription = this.contents[0].sectionDescription;
            this.getUrlFragment();
            if (this.targetUrl && this.targetUrl != null && this.targetUrl != '') {
                this.contents.forEach(content => {
                    if (this.targetUrl === content.targetUrl) {
                        this.index = (content.contentOrder - 1);
                    }
                });
            }
        });
    }

    ngAfterViewChecked() {
        this.openSection();
    }

    openSection(){
        if(this.targetUrl != this.url && this.targetUrl != null){
            this.url = this.targetUrl;
            document.getElementById('jacathon-Link').setAttribute('aria-expanded','true');
            document.getElementById('jacathon-Link').setAttribute('class','headLink');
            document.getElementById('jacathon').setAttribute('class','collapse show');
            var element = document.getElementById('jacathon-Link');
            $("html, body").animate({ scrollTop: $(element).offset().top - 200}, '500');
        }
    }
}
