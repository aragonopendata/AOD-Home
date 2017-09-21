import { Component, OnInit } from '@angular/core';
import { ConstantsService } from '../../app.constants';
import $ from 'jquery';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

	hovers: any[] = [];
	aodBaseUrl: string;
	presupuestosBaseUrl: string;

	constructor(private constants: ConstantsService) {
		this.aodBaseUrl = this.constants.AOD_BASE_URL;
        this.presupuestosBaseUrl = this.constants.PRESUPUESTOS_BASE_URL;
	}

	ngOnInit() {
		this.hovers = [
			{ id: '#imgBD', hover: false },
			{ id: '#imgTem', hover: false },
			{ id: '#imgPub', hover: false },
			{ id: '#imgAragopedia', hover: false },
			{ id: '#imgPre', hover: false },
			{ id: '#imgOSD', hover: false },
			{ id: '#imgCRAs', hover: false },
			{ id: '#imgInfo', hover: false },
			{ id: '#imgApp', hover: false },
			{ id: '#imgEv', hover: false },
			{ id: '#imgCol', hover: false },
			{ id: '#imgCampus', hover: false },
			{ id: '#imgDesa', hover: false },
			{ id: '#imgAPIs', hover: false },
			{ id: '#imgSPARQL', hover: false },
			{ id: '#imgGit', hover: false }
		];
	}

	move(id) {
		$('html, body').animate({ scrollTop: ($('.' + id).offset().top - $('#header').height()) }, '1000');
	}

	hover(id, src) {
		for (let hover of this.hovers) {
			if (hover.id === id) {
				hover.hover = !hover.hover;
			}
		}
		$(id).fadeOut(350, function () {
			$(id).attr('src', src);
			$(id).fadeIn(350);
		});
	}

	unhover(id, src) {
		for (let hover of this.hovers) {
			if (hover.id === id) {
				hover.hover = !hover.hover;
			}
		}
		$(id).fadeOut(350, function () {
			$(id).attr('src', src);
			$(id).fadeIn(350);
		});
	}

	goToUrl(url: string) {
		let fullUrl = '';
		if (url && url != undefined && url != '') {
			if (url.includes('aragopedia')) {
				fullUrl += this.aodBaseUrl + url;
				window.location.href = fullUrl;
			} else if (url.includes('presupuestos')) {
				fullUrl += this.presupuestosBaseUrl;
				window.location.href = fullUrl;
			} else if (url.includes('open-social-data')) {
				fullUrl += this.aodBaseUrl + url;
				window.location.href = fullUrl;
			} else if (url.includes('cras')) {
				fullUrl += this.aodBaseUrl + url;
				window.location.href = fullUrl;
			} else {
				window.location.href = url;
			}
		} else {
			return false;
		}
	}
}
