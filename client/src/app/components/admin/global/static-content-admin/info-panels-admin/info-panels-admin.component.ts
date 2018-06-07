import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaticContent } from '../../../../../models/StaticContent';
import { StaticContentService } from '../../../../../services/web/static-content.service';
import { Constants } from '../../../../../app.constants';
import { StaticContentAdminService } from '../../../../../services/admin/static-content-admin.service';
import { Observable } from 'rxjs/Observable';
import * as tinymce from '../../../../../../../node_modules/tinymce/tinymce';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-info-panels-admin',
    templateUrl: './info-panels-admin.component.html',
    styleUrls: ['./info-panels-admin.component.css']
})
export class InfoPanelsAdminComponent implements OnInit {

    public static doUpdate: Subject<any> = new Subject();

    sectionName: any;

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

    settings: any;

    constructor(private activatedRoute: ActivatedRoute,
    private staticContentAdminService: StaticContentAdminService) {

        InfoPanelsAdminComponent.doUpdate.subscribe(res => {
            this.initializeContents();
            this.sectionName = res;
            this.getStaticContent();
        });

        this.settings = {
            selector: '#editor',
            theme_url: Constants.AOD_ASSETS_BASE_URL + '/public/plugins/tinymce/themes/modern',
            skin_url: Constants.AOD_ASSETS_BASE_URL + '/public/plugins/tinymce/skins/lightgray',
            baseURL: Constants.AOD_ASSETS_BASE_URL + '/public/plugins/tinymce',
            plugins: [' advlist, lists, table, textcolor, image, link '],
            style_formats: [
                {title: 'Título 1', format: 'h1'},
                {title: 'Título 2', format: 'h2'},
                {title: 'Título 3', format: 'h3'},
                {title: 'Normal', format: 'p'},
                {title: 'Código', format: 'pre'},
            ],
            advlist_bullet_styles: "disc",
            advlist_number_styles: "default",
            image_dimensions: false,
            image_description: false,
            file_picker_types: 'image',
            toolbar: ' styleselect | bold italic underline | forecolor backcolor | numlist bullist | image link table ',
            menubar: false,
            branding: false,
            file_picker_callback: function (callback, value, meta) {
                if (meta.filetype == 'image') {
                    var input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.click();
                    input.onchange = function () {
                        var file = input.files[0];
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var id = 'blobid' + (new Date()).getTime();
                            var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                            var base64 = reader.result.split(',')[1];
                            var blobInfo = blobCache.create(id, file, base64);
                            blobCache.add(blobInfo);
                            callback(blobInfo.blobUri(), { title: file.name });
                        };
                        reader.readAsDataURL(file);
                    };
                }
            }
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

	save(content) {
		this.staticContentAdminService.setStaticContent(this.sectionName, content).subscribe();
    }

	editContent(index, event, content) {
        this.content = content;
        if(event.currentTarget.textContent === "Guardar"){
            this.save(this.content);
            this.contents[index].previewText = this.getPreviewText(this.contents[index].contentText);
        }
        this.contents[index].edit = !this.contents[index].edit;
    }
    
    getPreviewText(text){
        var tmpElmnt = document.createElement("div");
        tmpElmnt.innerHTML = text;
        return tmpElmnt.textContent || tmpElmnt.innerText || "";
    }

}
