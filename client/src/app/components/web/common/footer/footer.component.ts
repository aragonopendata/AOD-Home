import { Component, OnInit } from '@angular/core';
import { ConstantsService } from '../../../../app.constants';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
	aodBaseUrl: String

	constructor(private constants: ConstantsService) { 
		this.aodBaseUrl = this.constants.AOD_BASE_URL;
	}

	ngOnInit() {
	}

}
