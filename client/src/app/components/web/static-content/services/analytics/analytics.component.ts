import { Constants } from './../../../../../app.constants';
import { Component, NgModule } from '@angular/core'
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'
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

	constructor() { }

	ngOnInit() {
		var days = 90;
		var portal = "";

		jQuery("#analytics").attr('src', get_url(get_time(days), get_filter(portal)));

		jQuery(".timeAnalytics").click(function (event) {
			event.preventDefault();
			jQuery('#btng-time-analytics button.active').removeClass('active');
			jQuery(this).addClass('active')
			days = jQuery(this).val();
			jQuery("#analytics").attr('src', get_url(get_time(days), get_filter(portal)));
		});

		jQuery(".portalAnalytics").click(function (event) {
			event.preventDefault();
			jQuery('#btng-portal-analytics button.active').removeClass('active');
			jQuery(this).addClass('active')
			portal = jQuery(this).val();
			jQuery("#analytics").attr('src', get_url(get_time(days), get_filter(portal)));
		});

		function get_time(days) {
			var time = "(from:now-" + days + "d,mode:quick,to:now)";
			return time;
		}

		function get_filter(portal) {
			if(portal == ""){
				return "";
			}
			var filter = "('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'3c2d80f0-d5ed-11e7-a49d-f956d0989e2c',key:portal.keyword,negate:!f,params:(query:" + portal + ",type:phrase),type:phrase,value:" + portal + "),query:(match:(portal.keyword:(query:" + portal + ",type:phrase))))";
			return filter;
		}

		function get_url(time, filter) {
			var url = "http://localhost:14730/elastic/app/kibana#/dashboard/e6433860-d68c-11e7-a49d-f956d0989e2c?embed=true&_g=(refreshInterval:(display:Off,pause:!f,value:0),time:" + time + ")&_a=(description:'descripcion+descripcion',filters:!(" + filter + "),fullScreenMode:!f,options:(darkTheme:!f),panels:!((col:1,id:'534087c0-d682-11e7-a49d-f956d0989e2c',panelIndex:3,row:16,size_x:12,size_y:6,type:visualization),(col:1,id:'2b1be890-de87-11e7-9b2b-757dce07ac8f',panelIndex:13,row:6,size_x:12,size_y:6,type:visualization),(col:1,id:'3a794cb0-d9dc-11e7-9b2b-757dce07ac8f',panelIndex:14,row:12,size_x:6,size_y:2,type:visualization),(col:1,id:'98511a60-de88-11e7-9b2b-757dce07ac8f',panelIndex:15,row:1,size_x:12,size_y:3,type:visualization),(col:1,id:da0124b0-d9dc-11e7-9b2b-757dce07ac8f,panelIndex:16,row:4,size_x:12,size_y:2,type:visualization),(col:7,id:'7d1730b0-d9d6-11e7-9b2b-757dce07ac8f',panelIndex:17,row:12,size_x:6,size_y:2,type:visualization),(col:1,id:'32b9c250-de89-11e7-9b2b-757dce07ac8f',panelIndex:18,row:14,size_x:6,size_y:2,type:visualization),(col:7,id:'4cfa6e90-d9dd-11e7-9b2b-757dce07ac8f',panelIndex:19,row:14,size_x:6,size_y:2,type:visualization)),query:(language:lucene,query:''),timeRestore:!t,title:'Test+DashBoard',uiState:(P-13:(vis:(params:(sort:(columnIndex:!n,direction:!n)))),P-15:(vis:(defaultColors:('0+-+100':'rgb(0,104,55)'))),P-16:(spy:(mode:(fill:!f,name:!n))),P-3:(mapCenter:!(40.34654412118006,-3.8012695312500004),mapZoom:6)),viewMode:view)";
			return url;
		}
	}


}
