import { Constants } from './../../../../../app.constants';
import {Component, NgModule} from '@angular/core'
import {BrowserModule, DomSanitizer} from '@angular/platform-browser'

@Component({
	selector: 'app-collaboration',
	templateUrl: './collaboration.component.html',
	styleUrls: ['./collaboration.component.css']
})

export class CollaborationComponent {

  imgSrc;

  //Dynamic URL build parameters
  routerLinkCollaborationService;

  constructor(private domSanitizer : DomSanitizer) {
    
  }
  ngOnInit() {
      this.routerLinkCollaborationService = this.domSanitizer.bypassSecurityTrustResourceUrl(Constants.AOD_COLLABORATION_URL);
      this.imgSrc = Constants.AOD_ASSETS_BASE_URL + '/public/colabora/participa-opendata.jpg';
  }
}


