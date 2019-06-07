import { Component, OnInit } from '@angular/core';
declare const YASGUI: any;

@Component({
	selector: 'app-sparql-client',
	templateUrl: './sparql-client.component.html',
	styleUrls: ['./sparql-client.component.css']
})
export class SparqlClientComponent implements OnInit {

	constructor() {}

	ngOnInit() {
		this.showYasGUI();
	}

	showYasGUI() {
		YASGUI(document.getElementById("yasgui"), {
			yasqe:{sparql:{endpoint:'https://opendata.aragon.es/sparql'}}
		  });
	}
}