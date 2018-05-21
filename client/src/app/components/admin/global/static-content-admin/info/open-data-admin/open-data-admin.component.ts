import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaticContent } from '../../../../../../models/StaticContent';
import { StaticContentService } from '../../../../../../services/web/static-content.service';
import { Constants } from '../../../../../../app.constants';
import { StaticContentAdminService } from '../../../../../../services/admin/static-content-admin.service';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-open-data-admin',
	templateUrl: './open-data-admin.component.html',
	styleUrls: ['./open-data-admin.component.css']
})
export class OpenDataAdminComponent implements OnInit {

	edit: boolean = false;

    index: number = 0;
    content: StaticContent;
    contents: StaticContent[];
    targetUrl: string;
    url: string = null;

    errorTitle: string;
    errorMessage: string;
    openDataErrorTitle: string;
    openDataErrorMessage: string;

    constructor(private staticContentService: StaticContentService,
        private staticContentAdminService: StaticContentAdminService,
        private activatedRoute: ActivatedRoute) {
            
	}

	ngOnInit() {
		this.openDataErrorTitle = Constants.OPEN_DATA_STATIC_CONTENT_ERROR_TITLE;
        this.openDataErrorMessage = Constants.OPEN_DATA_STATIC_CONTENT_ERROR_MESSAGE;
        this.getStaticContentInfo();
	}

	getUrlFragment() {
        this.activatedRoute.fragment.subscribe(fragment => {
            this.targetUrl = fragment;
		});
    }

	getStaticContentInfo() {
        this.staticContentService.getOpenDataInfoStaticContent().subscribe(staticContent => {
            try {
                this.contents = staticContent;
                for (let i = 0; i < this.contents.length; i++) {
                    this.contents[i].previewText = this.getPreviewText(this.contents[i].contentText);
                }
                this.getUrlFragment();
                if (this.targetUrl && this.targetUrl != null && this.targetUrl != '') {
                    this.contents.forEach(content => {
                        if (this.targetUrl === content.targetUrl) {
                            this.index = (content.contentOrder - 1);
                        }
                    });
                }
            } catch (error) {
                console.error('Error: getStaticContentInfo() - open-data-admin.component.ts');
                this.errorTitle = this.openDataErrorTitle;
                this.errorMessage = this.openDataErrorMessage;
            }

        });
    }

    /*
        NOTE: Delete this method if finally it's not necessary.
    */
    getStaticContentInfoById(id: number){
        this.staticContentService.getOpenDataInfoStaticContentById(id).subscribe(staticContent => {
            try {
                this.content = staticContent;
                this.getUrlFragment();
                if (this.targetUrl && this.targetUrl != null && this.targetUrl != '') {
                    this.contents.forEach(c => {
                        if (this.targetUrl === c.targetUrl) {
                            this.index = (c.contentOrder - 1);
                        }
                    });
                }
            } catch (error) {
                console.error('Error: getStaticContentInfo() - open-data-admin.component.ts');
                this.errorTitle = this.openDataErrorTitle;
                this.errorMessage = this.openDataErrorMessage;
            }

        });
    }

	save(index, content) {
        console.log(content)
		this.staticContentAdminService.setOpenDataInfoStaticContent(content).subscribe();
    }

	editContent(index, event, content) {
        this.content = content;
        if(event.currentTarget.textContent === "Guardar"){
            this.save(index, this.content);
            this.contents[index].previewText = this.getPreviewText(this.contents[index].contentText);
        }
        this.contents[index].edit = !this.contents[index].edit;
    }
    
    getPreviewText(text){
        var tmpElmnt = document.createElement("div");
        tmpElmnt.innerHTML = text;
        return tmpElmnt.textContent || tmpElmnt.innerText || "";
    }

    addTable(index){
        var tableElement = document.createElement("table");
        var row1 = tableElement.insertRow(0);
        var row2 = tableElement.insertRow(1);
        var cell1 = row1.insertCell(0);
        var cell2 = row1.insertCell(1);
        var cell3 = row2.insertCell(0);
        var cell4 = row2.insertCell(1);

        cell1.innerHTML = "Hola";
        cell2.innerHTML = "soy";
        cell3.innerHTML = "Edu";
        cell4.innerHTML = "Feliz Navidad";

        this.contents[index].contentText += tableElement.innerHTML;
        console.log(this.contents[index].contentText);
    }

}
