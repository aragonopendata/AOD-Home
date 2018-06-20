import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../app.constants';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-visual-data',
    templateUrl: './visual-data.component.html',
    styleUrls: ['./visual-data.component.css']
})
export class VisualDataComponent implements OnInit {

    srcIframe;

    constructor(private domSanitizer : DomSanitizer) {
        this.srcIframe = this.domSanitizer.bypassSecurityTrustResourceUrl(Constants.AOD_BASE_URL + '/servicios/visualdata/adminPanel');
    }

    ngOnInit() {

    }

}
