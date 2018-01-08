import { Constants } from './../../../../../app.constants';
import { Component, NgModule } from '@angular/core'
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'
import { AnalyticsService } from '../../../../../services/web/analytics.service';
import { Logstash } from '../../../../../models/Logstash';
declare var jQuery: any;

@Component({
	selector: 'app-analytics',
	templateUrl: './analytics.component.html',
	styleUrls: ['./analytics.component.css']
})
@NgModule({
	imports: [BrowserModule],
	declarations: [AnalyticsComponent],
	bootstrap: [AnalyticsComponent]
})
export class AnalyticsComponent {

	logstashs: Logstash[];
	browsers_json = Constants.ELASTIC_BROWSERS + "?format=json";
	browsers_csv = Constants.ELASTIC_BROWSERS + "?format=csv";
	pages_json = Constants.ELASTIC_PAGES + "?format=json";
	pages_csv = Constants.ELASTIC_PAGES + "?format=csv";
	files_json = Constants.ELASTIC_FILES + "?format=json";
	files_csv = Constants.ELASTIC_FILES + "?format=csv";
	countries_json = Constants.ELASTIC_COUNTRIES + "?format=json";
	countries_csv = Constants.ELASTIC_COUNTRIES + "?format=csv";

	constructor(private logstashService: AnalyticsService) { }

	ngOnInit() {
		var days = 30;
		var portal = "Todos";
		

		jQuery("#analytics").attr('src', get_url(get_time(days), get_filter(portal)));
		jQuery("#sevendays").attr('src', get_url_seven(get_time('30'), get_filter(portal)));

		jQuery(".browsers .json").attr('href', this.browsers_json + "&portal=" + portal + "&days=" + days);
		jQuery(".browsers .csv").attr('href', this.browsers_csv + "&portal=" + portal + "&days=" + days);
		jQuery(".pages .json").attr('href', this.pages_json + "&portal=" + portal + "&days=" + days);
		jQuery(".pages .csv").attr('href', this.pages_csv + "&portal=" + portal + "&days=" + days);
		jQuery(".files .json").attr('href', this.files_json + "&portal=" + portal + "&days=" + days);
		jQuery(".files .csv").attr('href', this.files_csv + "&portal=" + portal + "&days=" + days);
		jQuery(".countries .json").attr('href', this.countries_json + "&portal=" + portal + "&days=" + days);
		jQuery(".countries .csv").attr('href', this.countries_csv + "&portal=" + portal + "&days=" + days);

		jQuery('.iframeAnalytics').on("click", ".timeAnalytics", function (event) {
			event.preventDefault();
			jQuery('.timeAnalyticsPral').html(jQuery(this).text() + ' <span class="caret"></span>');
			days = jQuery(this).val();
			jQuery("#analytics").attr('src', get_url(get_time(days), get_filter(portal)));

			jQuery(".browsers .json").attr('href', this.browsers_json + "&portal=" + portal + "&days=" + days);
			jQuery(".browsers .csv").attr('href', this.browsers_csv + "&portal=" + portal + "&days=" + days);
			jQuery(".pages .json").attr('href', this.pages_json + "&portal=" + portal + "&days=" + days);
			jQuery(".pages .csv").attr('href', this.pages_csv + "&portal=" + portal + "&days=" + days);
			jQuery(".files .json").attr('href', this.files_json + "&portal=" + portal + "&days=" + days);
			jQuery(".files .csv").attr('href', this.files_csv + "&portal=" + portal + "&days=" + days);
			jQuery(".countries .json").attr('href', this.countries_json + "&portal=" + portal + "&days=" + days);
			jQuery(".countries .csv").attr('href', this.countries_csv + "&portal=" + portal + "&days=" + days);
		});

		jQuery('.iframeAnalytics').on("click", ".portalAnalytics", function (event) {
			event.preventDefault();
			jQuery('.portalAnalyticsPral').html(jQuery(this).val() + ' <span class="caret"></span>');
			portal = jQuery(this).val();
			jQuery("#analytics").attr('src', get_url(get_time(days), get_filter(portal)));
			jQuery("#sevendays").attr('src', get_url_seven(get_time('30'), get_filter(portal)));

			jQuery(".browsers .json").attr('href', this.browsers_json + "&portal=" + portal + "&days=" + days);
			jQuery(".browsers .csv").attr('href', this.browsers_csv + "&portal=" + portal + "&days=" + days);
			jQuery(".pages .json").attr('href', this.pages_json + "&portal=" + portal + "&days=" + days);
			jQuery(".pages .csv").attr('href', this.pages_csv + "&portal=" + portal + "&days=" + days);
			jQuery(".files .json").attr('href', this.files_json + "&portal=" + portal + "&days=" + days);
			jQuery(".files .csv").attr('href', this.files_csv + "&portal=" + portal + "&days=" + days);
			jQuery(".countries .json").attr('href', this.countries_json + "&portal=" + portal + "&days=" + days);
			jQuery(".countries .csv").attr('href', this.countries_csv + "&portal=" + portal + "&days=" + days);
		});

		function get_time(days) {
			var time = "from:now-" + days + "d/d,"
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
			var url = Constants.KIBANA_URL;
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
			var url = Constants.KIBANA_URL_SEVEN;
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

		this.getFiles();

	}

	getFiles() {
		this.logstashs = [];
		this.logstashService.getFiles().subscribe(logstashs => {
			try {
				this.logstashs = JSON.parse(logstashs);
			} catch (error) {
				console.error('Error: getFiles() - logstash.component.ts', error);
			}
		});
	}

}
