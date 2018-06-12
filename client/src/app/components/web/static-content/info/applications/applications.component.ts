import { Component, OnInit } from '@angular/core';
import { StaticContent } from '../../../../../models/StaticContent';
import { StaticContentService } from '../../../../../services/web/static-content.service';
import { Constants } from "app/app.constants";
import { UtilsService } from '../../../../../services/web/utils.service';

@Component({
	selector: 'app-applications',
	templateUrl: './applications.component.html',
	styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {

	openedMenu: boolean;
	contents: StaticContent[];
    sectionTitle: string;
    sectionSubtitle: string;
	sectionDescription: string;

	errorTitle: string;
    errorMessage: string;
    applicationsErrorTitle: string;
    applicationsErrorMessage: string;
	
	constructor(private staticContentService: StaticContentService, private utilsService: UtilsService) {
		this.getOpenedMenu();
	}
	
	ngOnInit() {
		this.applicationsErrorTitle = Constants.APPLICATIONS_STATIC_CONTENT_ERROR_TITLE;
        this.applicationsErrorMessage = Constants.APPLICATIONS_STATIC_CONTENT_ERROR_MESSAGE;
		this.getStaticContentInfo();
	}

	getStaticContentInfo() {
		this.staticContentService.getApplicationsInfoStaticContent().subscribe(staticContent => {
			try {
				this.contents = staticContent;
				this.sectionTitle = this.contents[0].sectionTitle;
				this.sectionSubtitle = this.contents[0].sectionSubtitle;
				this.sectionDescription = this.contents[0].sectionDescription;
			} catch (error) {
				console.error('Error: getStaticContentInfo() - applications.component.ts');
                this.errorTitle = this.applicationsErrorTitle;
                this.errorMessage = this.applicationsErrorMessage;
			}
			
		});
	}

    getOpenedMenu(){
        this.utilsService.openedMenuChange.subscribe(value => {
			this.openedMenu = value;
		});
    }
}
