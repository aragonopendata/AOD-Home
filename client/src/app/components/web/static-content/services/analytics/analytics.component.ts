import { Constants } from './../../../../../app.constants';
import { Component, NgModule } from '@angular/core'
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'
import { AnalyticsService } from '../../../../../services/web/analytics.service';
import { Logstash } from '../../../../../models/Logstash';
import { UtilsService } from '../../../../../services/web/utils.service';
declare var jQuery: any;

@Component({
	selector: 'app-analytics',
	templateUrl: './analytics.component.html',
	styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent {

	openedMenu: boolean;
	logstashs: Logstash[];
	isIframeActive = true;

	aodBaseUrl: String;
	routerLinkDataCatalogDataset: String;

	constructor(private logstashService: AnalyticsService,
		private utilsService: UtilsService) {
		this.aodBaseUrl = window["config"]["AOD_BASE_URL"];
		this.routerLinkDataCatalogDataset = Constants.ROUTER_LINK_DATA_CATALOG_DATASET
		this.getOpenedMenu();
	}

	ngOnInit() {
		var days = "now/y";
		var portal = "Todos";


		jQuery("#analytics").attr('src', get_url(get_time(days), get_filter(portal)));
		jQuery("#sevendays").attr('src', get_url_seven(get_time('now-30d/d'), get_filter(portal)));

		jQuery(".browsers.json").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_BROWSERS, "json", days, portal));
		jQuery(".browsers.csv").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_BROWSERS, "csv", days, portal));

		jQuery(".pages.json").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_PAGES, "json", days, portal));
		jQuery(".pages.csv").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_PAGES, "csv", days, portal));

		jQuery(".files.json").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_FILES, "json", days, portal));
		jQuery(".files.csv").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_FILES, "csv", days, portal));

		jQuery(".countries.json").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_COUNTRIES, "json", days, portal));
		jQuery(".countries.csv").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_COUNTRIES, "csv", days, portal));

		jQuery('.iframeAnalytics').on("click", ".timeAnalytics", function (event) {
			event.preventDefault();
			jQuery('.timeAnalyticsPral').html(jQuery(this).text() + ' <span class="caret"></span>');
			days = jQuery(this).val();
			jQuery("#analytics").attr('src', get_url(get_time(days), get_filter(portal)));

			jQuery(".browsers.json").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_BROWSERS, "json", days, portal));
			jQuery(".browsers.csv").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_BROWSERS, "csv", days, portal));

			jQuery(".pages.json").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_PAGES, "json", days, portal));
			jQuery(".pages.csv").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_PAGES, "csv", days, portal));

			jQuery(".files.json").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_FILES, "json", days, portal));
			jQuery(".files.csv").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_FILES, "csv", days, portal));

			jQuery(".countries.json").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_COUNTRIES, "json", days, portal));
			jQuery(".countries.csv").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_COUNTRIES, "csv", days, portal));
		});

		jQuery('.iframeAnalytics').on("click", ".portalAnalytics", function (event) {
			event.preventDefault();
			jQuery('.portalAnalyticsPral').html(jQuery(this).val() + ' <span class="caret"></span>');
			portal = jQuery(this).val();
			jQuery("#analytics").attr('src', get_url(get_time(days), get_filter(portal)));
			jQuery("#sevendays").attr('src', get_url_seven(get_time('now-30d/d'), get_filter(portal)));

			jQuery(".browsers.json").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_BROWSERS, "json", days, portal));
			jQuery(".browsers.csv").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_BROWSERS, "csv", days, portal));

			jQuery(".pages.json").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_PAGES, "json", days, portal));
			jQuery(".pages.csv").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_PAGES, "csv", days, portal));

			jQuery(".files.json").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_FILES, "json", days, portal));
			jQuery(".files.csv").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_FILES, "csv", days, portal));

			jQuery(".countries.json").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_COUNTRIES, "json", days, portal));
			jQuery(".countries.csv").attr('href', get_url_export(window["config"]["AOD_BASE_URL"] + Constants.ELASTIC_COUNTRIES, "csv", days, portal));
		});

		function get_time(days) {
			var time = "from:" + days + ","
				+ "mode:quick,"
				+ "to:now";

			return time;
		}

		function get_filter(portal) {
			if (portal == "Todos") {
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
				+ "query:" + portal + ","
				+ "type:phrase"
				+ "),"
				+ "type:phrase,"
				+ "value:" + portal
				+ "),query:("
				+ "match:("
				+ "portal.keyword:("
				+ "query:" + portal + ","
				+ "type:phrase"
				+ ")"
				+ ")"
				+ ")"
				+ ")";

			return filter;
		}

		function get_url(time, filter) {
			var url = window["config"]["AOD_BASE_URL"] + Constants.KIBANA_URL;
			url = url + "?embed=true";
			url = url + "&_g=("
				+ "refreshInterval:("
				+ "display:Off,"
				+ "pause:!f,"
				+ "value:0"
				+ "),"
				+ "time:("
				+ time
				+ ")"
				+ ")";

			url = url + "&_a=("
				+ "description:'',"
				+ "filters:!("
				+ filter
				+ "),"
				+ "viewMode:view"
				+ ")";

			return url;
		}

		function get_url_seven(time, filter) {
			var url = window["config"]["AOD_BASE_URL"] + window["config"]["AOD_BASE_URL"] + Constants.KIBANA_URL_SEVEN;
			url = url + "?embed=true";
			url = url + "&_g=("
				+ "refreshInterval:("
				+ "display:Off,"
				+ "pause:!f,"
				+ "value:0"
				+ "),"
				+ "time:("
				+ time
				+ ")"
				+ ")";

			url = url + "&_a=("
				+ "description:'',"
				+ "filters:!("
				+ filter
				+ "),"
				+ "viewMode:view"
				+ ")";

			return url;
		}

		function get_url_export(path, format, days, portal) {
			var url_return = path + "?extension=" + format + "&portal=" + portal + "&days=" + encodeURIComponent(days);
			return url_return;
		}

		this.getFiles();

	}

	getFiles() {
		this.logstashs = [];
		this.logstashService.getFiles().subscribe(logstashs => {
			this.logstashs = logstashs.message;
		});
	}

	getOpenedMenu(){
		this.utilsService.openedMenuChange.subscribe(value => {
			this.openedMenu = value;
		});
	}
}
