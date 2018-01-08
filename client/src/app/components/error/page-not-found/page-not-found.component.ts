import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../../app.constants';

@Component({
	selector: 'app-page-not-found',
	templateUrl: './page-not-found.component.html',
	styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

	routerLinkDataCatalog: string;

	constructor(private router: Router) {
		this.routerLinkDataCatalog = Constants.ROUTER_LINK_DATA_CATALOG;
	 }

	ngOnInit() {
	}

	searchDatasetsByText(text: string){
		this.router.navigate(['/' + this.routerLinkDataCatalog], { queryParams: { texto: text} });

	}
}
