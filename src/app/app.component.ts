import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {

    translate: any;

    constructor(private translateService: TranslateService) { 
        this.translate = translateService.setDefaultLang('es');
    }

    ngOnInit() {
    }

    switchLanguage(language: string) {
        this.translate = this.translateService.use(language);
    }

}

    