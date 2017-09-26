import { Component, OnInit } from '@angular/core';
import { StaticContent } from '../../../../../models/StaticContent';
import { StaticContentService } from '../../../../../services/web/static-content.service';

@Component({
    selector: 'app-developers',
    templateUrl: './developers.component.html',
    styleUrls: ['./developers.component.css']
})
export class DevelopersComponent implements OnInit {

    contents: StaticContent[];
    sectionTitle: string;
    sectionSubtitle: string;
    sectionDescription: string;

    constructor(private staticContentService: StaticContentService) { }

    ngOnInit() {
        this.getStaticContentInfo();
    }

    getStaticContentInfo() {
        this.staticContentService.getDevelopersToolsStaticContent().subscribe(staticContent => {
            this.contents = staticContent;
            this.sectionTitle = this.contents[0].sectionTitle;
            this.sectionSubtitle = this.contents[0].sectionSubtitle;
            this.sectionDescription = this.contents[0].sectionDescription;
        });
    }
}
