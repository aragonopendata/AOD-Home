import { Component, OnInit, ElementRef } from '@angular/core';
import { Constants } from '../../../../../../app.constants';
declare const YASGUI: any;

@Component({
	selector: 'app-sparql-client',
	templateUrl: './sparql-client.component.html',
	styleUrls: ['./sparql-client.component.css']
})
export class SparqlClientComponent implements OnInit {

	yasgui: any;

	constructor(private elem: ElementRef) {}

	ngOnInit() {
		this.showYasGUI();
	}

	showYasGUI() {
		this.yasgui = YASGUI(document.getElementById("yasgui"), {
			yasqe:{sparql:{endpoint: Constants.SPARQL_ENDPOINT_URL}}
		  });
		let elementsBtnFullScreen = this.elem.nativeElement.querySelectorAll('.btn_fullscreen');
		elementsBtnFullScreen.forEach(element => {
			element.remove()
		});
		let elementsYasqueFullScreen = this.elem.nativeElement.querySelectorAll('.yasqe_fullscreenBtn');
		elementsYasqueFullScreen.forEach(element => {
			element.remove()
		});
		let elementsControlBar = this.elem.nativeElement.querySelectorAll('.controlbar');
		elementsControlBar.forEach(element => {
			element.remove()
		});
	}
}