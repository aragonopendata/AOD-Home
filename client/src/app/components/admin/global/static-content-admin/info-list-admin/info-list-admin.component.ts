import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import * as tinymce from '../../../../../../../node_modules/tinymce/tinymce';
import { StaticContent } from '../../../../../models/StaticContent';
import { ActivatedRoute } from '@angular/router';
import { StaticContentAdminService } from '../../../../../services/admin/static-content-admin.service';
import { Constants } from '../../../../../app.constants';
import { UsersAdminService } from '../../../../../services/admin/users-admin.service';
import { User } from '../../../../../models/User';

@Component({
    selector: 'app-info-list-admin',
    templateUrl: './info-list-admin.component.html',
    styleUrls: ['./info-list-admin.component.css']
})
export class InfoListAdminComponent implements OnInit {

    public static doUpdate: Subject<any> = new Subject();

    sectionName: any;

    edit: boolean = false;
    memberRol: string;
    currentUser: User;
    display: boolean = false;

    index: number = 0;
    content: StaticContent;
    contents: StaticContent[];
    targetUrl: string;
    url: string = null;

    errorTitle: string;
    errorMessage: string;
    openDataErrorTitle: string;
    openDataErrorMessage: string;

    title: string = "";
    titleURL: string = "";
    description: string = "";
    img: File;
    imgSRC: string = "";


    settings: any;

    constructor(private activatedRoute: ActivatedRoute,
        private staticContentAdminService: StaticContentAdminService,
        private usersAdminService: UsersAdminService) {

        this.memberRol = Constants.ADMIN_USER_ROL_GLOBAL_ADMIN;
        this.currentUser = this.usersAdminService.currentUser;

        InfoListAdminComponent.doUpdate.subscribe(res => {
            this.initializeContents();
            this.sectionName = res;
            this.getStaticContent();
        });

        this.settings = {
            selector: '#editor',
            theme_url: Constants.AOD_ASSETS_BASE_URL + '/public/plugins/tinymce/themes/modern',
            skin_url: Constants.AOD_ASSETS_BASE_URL + '/public/plugins/tinymce/skins/lightgray',
            baseURL: Constants.AOD_ASSETS_BASE_URL + '/public/plugins/tinymce',
            plugins: [' link '],
            toolbar: ' bold italic underline | link ',
            menubar: false,
            branding: false
        }
    }

    ngOnInit() {
        this.openDataErrorTitle = Constants.OPEN_DATA_STATIC_CONTENT_ERROR_TITLE;
        this.openDataErrorMessage = Constants.OPEN_DATA_STATIC_CONTENT_ERROR_MESSAGE;
        this.getParam();
        this.getStaticContent();
    }

    initializeContents(){
        this.sectionName = "";
        this.contents = [];
    }

    getParam(){
        this.activatedRoute.params.subscribe(params => {
            this.sectionName = params[Constants.ROUTER_LINK_DATA_PARAM_SECTION_NAME];
        });
    }

    getUrlFragment() {
        this.activatedRoute.fragment.subscribe(fragment => {
            this.targetUrl = fragment;
		});
    }

    getStaticContent() {
        this.staticContentAdminService.getStaticContentBySectionName(this.sectionName).subscribe(staticContent => {
            try {
                this.contents = staticContent;
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

    showDialog(content: StaticContent){
        this.content = content;
        this.title = this.content.contentTitle;
        this.setElements();
        this.display = !this.display;
    }

    setElements() {
        let appInfo = this.content.contentText;
        var parser = new DOMParser();
        let element = parser.parseFromString(appInfo, 'text/html');
        this.getTitleURL(element);
        this.getDescription(element);
        this.getImage(element);
    }

    getTitleURL(element: Document){
        this.titleURL = element.getElementsByClassName("app_info").item(0).getElementsByTagName("a").item(0).getAttribute("href");
    }

    getDescription(element: Document){
        this.description = element.getElementsByClassName("app_info").item(0).getElementsByTagName("p").item(1).innerHTML;
    }

    getImage(element: Document){
        this.imgSRC = element.getElementsByClassName("app_img").item(0).getElementsByTagName("img").item(0).getAttribute("src");
    }

    fileChange(event){
        this.img = event.target.files;
    }

    cancel(){
        this.display = !this.display;
    }

    save(title: string, titleURL: string, description: string, imgSRC: string){
        this.buildNewConent(title, titleURL, description, imgSRC);
        this.display = !this.display;
    }

    buildNewConent(title: string, titleURL: string, description: string, imgSRC: string){
        let appInfo = this.content.contentText;
        var parser = new DOMParser();
        let element = parser.parseFromString(appInfo, 'text/html');
        this.setTitle(element, title);
        this.setTitleURL(element, titleURL);
        this.setDescription(element, description);
        if(this.img){
            this.staticContentAdminService.uploadImage(this.sectionName, this.img).subscribe(data => {
                if(data){
                    this.setSRC(element, this.img);
                }
            }, error => {
                console.log(error);
            });
        }
        this.content.contentText = element.body.innerHTML;
        this.staticContentAdminService.setStaticContent(this.sectionName, this.content).subscribe();
    }

    setTitle(element: Document, title: string){
        this.content.contentTitle = title;
        element.getElementsByClassName("app_info").item(0).getElementsByTagName("b").item(0).innerText = title;
    }

    setTitleURL(element: Document, titleURL: string){
        element.getElementsByClassName("app_img").item(0).getElementsByTagName("a").item(0).setAttribute("href", titleURL);
        element.getElementsByClassName("app_info").item(0).getElementsByTagName("a").item(0).setAttribute("href", titleURL);
    }

    setDescription(element: Document, description: string){
        if(description.startsWith("<p>") && description.endsWith("</p>")){
            description = description.replace("<p>", "");
            description = description.replace("</p>", "");
        }
        element.getElementsByClassName("app_info").item(0).getElementsByTagName("p").item(1).innerHTML = description;
    }

    setSRC(element: Document, img: File){
        let src = element.getElementsByClassName("app_img").item(0).getElementsByTagName("img").item(0).getAttribute("src");
        let srcSplited = src.split('/');
        srcSplited[srcSplited.length - 1] = img[0].name;
        src = srcSplited.join('/');
        element.getElementsByClassName("app_img").item(0).getElementsByTagName("img").item(0).setAttribute("src", src);
    }

}
