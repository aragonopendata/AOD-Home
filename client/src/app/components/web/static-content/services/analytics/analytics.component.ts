import { Constants } from './../../../../../app.constants';
import { Component } from '@angular/core'
import { AnalyticsService } from '../../../../../services/web/analytics.service';
import { Logstash } from '../../../../../models/Logstash';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-analytics',
	templateUrl: './analytics.component.html',
	styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent {

	aodBaseUrl: string;
	routerLinkDataCatalogDataset: string;
	openedMenu: boolean;
	portales: Logstash[];

	currentDay: any;
	currentPortal: Logstash;
	sevenurl: string;
	globalurl: string;

	allPortal: Logstash = {
		id_logstash: '*',
		portal_name: 'Todos',
		type: '',
		view: '',
		delay: '',
		status: '',
		url: 'Todos'
	};

	days: any[] = [

		{
			name: 'Ayer',
			value: 'now-1d/d'
		},
		{
			name: '7 días',
			value: 'now-7d/d'
		},
		{
			name: '15 días',
			value: 'now-15d/d'
		},
		{
			name: '30 días',
			value: 'now-30d/d'
		},
		{
			name: 'Año actual',
			value: 'now/y'
		}
	]

	constructor(private analyticsService: AnalyticsService,
		private sanitizer: DomSanitizer) {
		this.currentPortal = this.allPortal;
		this.currentDay = this.days[4];
		this.portales = [];
		this.sevenurl = '';
		this.globalurl = '';
		this.aodBaseUrl = window["config"]["AOD_BASE_URL"];
		this.routerLinkDataCatalogDataset = Constants.ROUTER_LINK_DATA_CATALOG_DATASET
	}

	ngOnInit() {
		this.getFiles();
		this.sevenurl = this.sevenFilter();
		this.globalurl = this.globalfilter();
	}

	getFiles() {
		this.analyticsService.getFiles().subscribe(logstashs => {
			this.portales = logstashs.message;
		});
	}

	changePortal(portal: Logstash) {
		this.currentPortal = portal;
		this.sevenurl = this.sevenFilter();
		this.globalurl = this.globalfilter();
	}

	changeTime(day: any) {
		this.currentDay = day;
		this.sevenurl = this.sevenFilter();
		this.globalurl = this.globalfilter();
	}

	exportPages(type: string) {
		let url = this.aodBaseUrl + Constants.ELASTIC_PAGES + "?extension=" + type + "&portal=" + this.currentPortal.id_logstash + "&days=" + encodeURIComponent(this.currentDay.value);
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

	exportBrowsers(type: string) {
		let url = this.aodBaseUrl + Constants.ELASTIC_BROWSERS + "?extension=" + type + "&portal=" + this.currentPortal.id_logstash + "&days=" + encodeURIComponent(this.currentDay.value);
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

	exportFiles(type: string) {
		let url = this.aodBaseUrl + Constants.ELASTIC_FILES + "?extension=" + type + "&portal=" + this.currentPortal.id_logstash + "&days=" + encodeURIComponent(this.currentDay.value);
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

	exportCountries(type: string) {
		let url = this.aodBaseUrl + Constants.ELASTIC_COUNTRIES + "?extension=" + type + "&portal=" + this.currentPortal.id_logstash + "&days=" + encodeURIComponent(this.currentDay.value);
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

	filterTime() {
		var time = "from:" + this.currentDay.value + ","
			+ "mode:quick,"
			+ "to:now";

		return time;
	}

	filterPortal() {
		if (this.currentPortal.url == "Todos") {
			return "";
		}
		var filter = "("
			+ "'$state':("
			+ "store:appState"
			+ "),"
			+ "meta:("
			+ "alias:!n,"
			+ "disabled:!f,"
			+ "index:'3c2d80f0-d5ed-11e7-a49d-f956d0989e2c',"
			+ "key:portal.keyword,"
			+ "negate:!f,"
			+ "params:("
			+ "query:" + this.currentPortal.url + ","
			+ "type:phrase"
			+ "),"
			+ "type:phrase,"
			+ "value:" + this.currentPortal.url
			+ "),query:("
			+ "match:("
			+ "portal.keyword:("
			+ "query:" + this.currentPortal.url + ","
			+ "type:phrase"
			+ ")"
			+ ")"
			+ ")"
			+ ")";

		return filter;
	}

	globalfilter() {
		var url = window["config"]["AOD_BASE_URL"] + window["config"]["KIBANA_URL"];
		url = url + "?embed=true";
		url = url + "&_g=("
			+ "refreshInterval:("
			+ "display:Off,"
			+ "pause:!f,"
			+ "value:0"
			+ "),"
			+ "time:("
			+ this.filterTime()
			+ ")"
			+ ")";

		url = url + "&_a=("
			+ "description:'',"
			+ "filters:!("
			+ this.filterPortal()
			+ "),"
			+ "viewMode:view"
			+ ")";

		return url;
	}

	sevenFilter() {
		var url = window["config"]["AOD_BASE_URL"] + window["config"]["KIBANA_URL_SEVEN"];
		url = url + "?embed=true";
		url = url + "&_g=("
			+ "refreshInterval:("
			+ "display:Off,"
			+ "pause:!f,"
			+ "value:0"
			+ "),"
			+ "time:("
			+ "from:"
			+ "now-30d/d"
			+ ","
			+ "mode:quick,"
			+ "to:now"
			+ ")"
			+ ")";

		url = url + "&_a=("
			+ "description:'',"
			+ "filters:!("
			+ this.filterPortal()
			+ "),"
			+ "viewMode:view"
			+ ")";

		return url;
	}
}
