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

	sanitizer: DomSanitizer

	constructor(private analyticsService: AnalyticsService,
		private s: DomSanitizer) {
		this.sanitizer = s;
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
	}

	getFiles() {
		this.analyticsService.getFiles().subscribe(logstashs => {
			this.portales = logstashs.message;
			this.sevenurl = this.sevenFilter();
			this.globalurl = this.globalfilter();
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
		var eportal = "&portal=" + this.currentPortal.id_logstash;

		if (eportal == '&portal=*') {
			eportal = '';
			this.portales.forEach((p) => {
				eportal = eportal + "&portal=" +p.id_logstash;
			})
		}

		let url = this.aodBaseUrl + Constants.ELASTIC_PAGES + "?extension=" + type + eportal + "&days=" + encodeURIComponent(this.currentDay.value);
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

	exportBrowsers(type: string) {
		var eportal = "&portal=" + this.currentPortal.id_logstash;

		if (eportal == '&portal=*') {
			eportal = '';
			this.portales.forEach((p) => {
				eportal = eportal + "&portal=" +p.id_logstash;
			})
		}

		let url = this.aodBaseUrl + Constants.ELASTIC_BROWSERS + "?extension=" + type + eportal + "&days=" + encodeURIComponent(this.currentDay.value);
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

	exportFiles(type: string) {
		var eportal = "&portal=" + this.currentPortal.id_logstash;

		if (eportal == '&portal=*') {
			eportal = '';
			this.portales.forEach((p) => {
				eportal = eportal + "&portal=" +p.id_logstash;
			})
		}

		let url = this.aodBaseUrl + Constants.ELASTIC_FILES + "?extension=" + type + eportal + "&days=" + encodeURIComponent(this.currentDay.value);
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

	exportCountries(type: string) {

		var eportal = "&portal=" + this.currentPortal.id_logstash;

		if (eportal == '&portal=*') {
			eportal = '';
			this.portales.forEach((p) => {
				eportal = eportal + "&portal=" +p.id_logstash;
			})
		}

		let url = this.aodBaseUrl + Constants.ELASTIC_COUNTRIES + "?extension=" + type + eportal + "&days=" + encodeURIComponent(this.currentDay.value);
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

	filterTime() {
		var time = "from:" + this.currentDay.value + ","
			+ "mode:quick,"
			+ "to:now";

		return time;
	}

	filterPortal() {

		var portal = this.currentPortal.url;
		var params = portal;
		var value = portal;
		var query = "("
						+ "match_phrase:("
							+ "portal.keyword:" + portal
						+")"
					+ ")";

		if (portal == "Todos") {
			params = '';
			value = '';
			query = '';
			this.portales.forEach(cportal => {
				params = params + ',' + cportal.url;
				value = value + ',+' + cportal.url;
				query = query + ',' + "("
										+ "match_phrase:("
											+ "portal.keyword:" + cportal.url
										+")"
									+ ")";
			});
			if (params.length > 0){
				params = params.substr(1, params.length);
			}
			if (value.length > 0){
				value = value.substr(2, value.length);
			}
			if (query.length > 0){
				query = query.substr(1, query.length);
			}
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
							+ "params:!("
								+ params
							+ "),"
							+ "type:phrases,"
							+ "value:'" + value + "'"
						+ "),query:("
							+ "bool:("
								+ "minimum_should_match:1,"
								+ "should:!("
									+ query
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
