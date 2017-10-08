import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../../../app.constants';

@Component({
	selector: 'app-collaboration',
	templateUrl: './collaboration.component.html',
	styleUrls: ['./collaboration.component.css']
})
export class CollaborationComponent implements OnInit {

	//Dynamic URL build parameters
	routerLinkCollaborationService: string;

	constructor() { 
		this.routerLinkCollaborationService = Constants.AOD_COLLABORATION_URL;
	}

	ngOnInit() {
	}

}
