import { Component, OnInit, ElementRef } from '@angular/core';
import { Constants } from '../../../../../../app.constants';
//declare const YASGUI: any;
declare const YASQE: any;
declare const YASR: any;

@Component({
	selector: 'app-sparql-client',
	templateUrl: './sparql-client.component.html',
	styleUrls: ['./sparql-client.component.css']
})
export class SparqlClientComponent implements OnInit {

	//yasgui: any;
	yasqe: any;
	yasr: any;

	constructor(private elem: ElementRef) {}

	ngOnInit() {
		this.showYasGUI();
	}

	showYasGUI() {
		/*this.yasgui = YASGUI(document.getElementById("yasgui"), {
			yasqe:{sparql:{endpoint: Constants.SPARQL_ENDPOINT_URL}}
		  });*/
		var yasqe = YASQE(document.getElementById("yasqe"), {
			backdrop: true,
			persistent: null,
			sparql: {
				endpoint: Constants.SPARQL_ENDPOINT_URL,
				showQueryButton: true
			}
		});
		var yasr = YASR(document.getElementById("yasr"),{
			getUsedPrefixes: yasqe.getPrefixesFromQuery
		});

		// link both together
		yasqe.options.sparql.handlers.success =  function(data,status,response) {
			yasr.setResponse({
				response	: data,
				contentType	: response.getResponseHeader("Content-Type")
			});
		};
		yasqe.options.sparql.handlers.error = function(xhr,textStatus,errorThrown) {
			yasr.setResponse({
				exception: textStatus + ": " + errorThrown
			});
		};
		yasqe.options.sparql.callbacks.complete = yasr.setResponse;
		yasr.options.getUsedPrefixes = yasqe.getPrefixesFromQuery;
		/*let elementsBtnFullScreen = this.elem.nativeElement.querySelectorAll('.btn_fullscreen');
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
		let elementsGoogleChart = this.elem.nativeElement.querySelectorAll('.select_gchart');
		elementsGoogleChart.forEach(element => {
			element.remove()
		});
		let elementsMainTabs = this.elem.nativeElement.querySelectorAll('.mainTabs');
		elementsMainTabs.forEach(element => {
			element.remove()
		});*/
	}
}