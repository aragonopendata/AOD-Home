import { Component, OnInit } from '@angular/core';
import { AccordionModule } from 'primeng/primeng';
import { StaticContent } from '../../../../../models/StaticContent';
import { StaticContentService } from '../../../../../services/web/static-content.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-open-data',
    templateUrl: './open-data.component.html',
    styleUrls: ['./open-data.component.css']
})
export class OpenDataComponent implements OnInit {
    index: number = 0;
    contents: StaticContent[];
    sectionTitle: string;
    sectionSubtitle: string;
    sectionDescription: string;
    targetUrl: string;

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
        this.staticContentService.getOpenDataInfoStaticContent().subscribe(staticContent => {
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
}
