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

	constructor(private logstashService: AnalyticsService) { }

	ngOnInit() {
		var days = 90;
		var portal = "Todos";

		jQuery("#analytics").attr('src', get_url(get_time(days), get_filter(portal)));

		jQuery('.iframeAnalytics').on("click", ".timeAnalytics", function (event) {
			event.preventDefault();
			jQuery('#btng-time-analytics button.active').removeClass('active');
			jQuery(this).addClass('active')
			days = jQuery(this).val();
			jQuery("#analytics").attr('src', get_url(get_time(days), get_filter(portal)));
		});

		jQuery('.iframeAnalytics').on("click", ".portalAnalytics", function (event) {
			event.preventDefault();
			jQuery('.portalAnalyticsPral').html(jQuery(this).val() + ' <span class="caret"></span>');
			portal = jQuery(this).val();
			jQuery("#analytics").attr('src', get_url(get_time(days), get_filter(portal)));
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
