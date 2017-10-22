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
        });
    }

    ngAfterViewChecked() {
        this.openSection();
    }

    openSection(){
        if(this.targetUrl != this.url && this.targetUrl != null){
            this.url = this.targetUrl;
            var element = document.getElementById(this.url+'Link');
            $("html, body").animate({ scrollTop: $(element).offset().top - ($('#header').height()+$('.card-header').height())}, '500');
            document.getElementById(this.url+'Link').setAttribute('aria-expanded','true');
            document.getElementById(this.url+'Link').setAttribute('class','headLink');
            document.getElementById(this.url).setAttribute('class','collapse show');
        }
    }
}
