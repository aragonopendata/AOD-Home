import { Component, OnInit } from '@angular/core';
import { StaticContent } from '../../../../../models/StaticContent';
import { StaticContentService } from '../../../../../services/web/static-content.service';

@Component({
    selector: 'app-sparql',
    templateUrl: './sparql.component.html',
    styleUrls: ['./sparql.component.css']
})
export class SparqlComponent implements OnInit {

    contents: StaticContent[];
    sectionTitle: string;
    sectionSubtitle: string;
    sectionDescription: string;

    constructor(private staticContentService: StaticContentService) { }

    ngOnInit() {
        this.getStaticContentInfo();
    }

    getStaticContentInfo() {
        this.staticContentService.getSparqlToolsStaticContent().subscribe(staticContent => {            
            this.contents = staticContent;
            this.sectionTitle = this.contents[0].sectionTitle;
            this.sectionSubtitle = this.contents[0].sectionSubtitle;
            this.sectionDescription = this.contents[0].sectionDescription;
        });
    }
}
