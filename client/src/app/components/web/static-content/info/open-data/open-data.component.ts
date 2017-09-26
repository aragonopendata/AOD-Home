import { Component, OnInit } from '@angular/core';
import { AccordionModule } from 'primeng/primeng';
import { StaticContent } from '../../../../../models/StaticContent';
import { StaticContentService } from '../../../../../services/web/static-content.service';

@Component({
    selector: 'app-open-data',
    templateUrl: './open-data.component.html',
    styleUrls: ['./open-data.component.css']
})
export class OpenDataComponent implements OnInit {
    activeIndex: number;
    contents: StaticContent[];
    sectionTitle: string;
    sectionSubtitle: string;
    sectionDescription: string;

    constructor(private staticContentService: StaticContentService) { }

    ngOnInit() {
        this.getStaticContentInfo();
    }

    getStaticContentInfo() {
        this.staticContentService.getOpenDataInfoStaticContent().subscribe(staticContent => {
            this.contents = staticContent;
            this.sectionTitle = this.contents[0].sectionTitle;
            this.sectionSubtitle = this.contents[0].sectionSubtitle;
            this.sectionDescription = this.contents[0].sectionDescription;
        });
    }
}
