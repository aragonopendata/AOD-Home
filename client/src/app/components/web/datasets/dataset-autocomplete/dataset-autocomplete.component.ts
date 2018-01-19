import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Constants } from '../../../../app.constants';
import { DatasetsService } from '../../../../services/web/datasets.service';
import { Dataset } from '../../../../models/Dataset';
import { Autocomplete } from '../../../../models/Autocomplete';
declare var jQuery:any;

@Component({
	host: {'(document:click)': 'onClick($event)'},
	selector: 'dataset-autocomplete',
	templateUrl: './dataset-autocomplete.component.html',
	styleUrls: ['./dataset-autocomplete.component.css'],
	providers: [DatasetsService]
})

export class DatasetAutocompleteComponent implements OnInit {

	dataset: Dataset;
	datasetAutocomplete: Autocomplete[];
	private datasetTitle = new Subject<string>();
	private resultsLimit: number;
	//Dynamic URL build parameters
    routerLinkDataCatalog: string;
	routerLinkDataCatalogDataset: string;
	resultsExtended: boolean;
	text: string;

	constructor(private datasetService: DatasetsService, private router: Router, private _eref: ElementRef) {
		this.resultsLimit = Constants.DATASET_AUTOCOMPLETE_LIMIT_RESULTS;
		this.routerLinkDataCatalog = Constants.ROUTER_LINK_DATA_CATALOG;
		this.routerLinkDataCatalogDataset = Constants.ROUTER_LINK_DATA_CATALOG_DATASET;
	}

	ngOnInit(): void {
		this.getAutocomplete();
	}

	search(title: string): void {
		//Lectura cuando hay al menos 3 caracteres
		if (title.length >= Constants.DATASET_AUTOCOMPLETE_MIN_CHARS) {
			this.text = title;
			this.datasetTitle.next(title);
		} else {
			this.datasetAutocomplete = null;
		}
	}

	//Búsqueda autocomplete
	getAutocomplete(): void {
		this.datasetTitle
			.debounceTime(Constants.DATASET_AUTOCOMPLETE_DEBOUNCE_TIME)
			.distinctUntilChanged()
			.switchMap(title => title
				? this.datasetService.getDatasetsAutocomplete(title, this.resultsLimit)
				: Observable.of<Autocomplete[]>([]))
			.catch(error => {
				console.error(error);
				return Observable.of<Autocomplete[]>([]);
			}).subscribe(data => {
				 try {
					this.datasetAutocomplete = <Autocomplete[]>JSON.parse(data).result;
				} catch (error) {
					console.error("Error: getAutocomplete() - datasets-autocomplete.component.ts");
				}
				
			});
	}

	searchDatasetsByText(text: string){
		this.router.navigate(['/' + this.routerLinkDataCatalog], { queryParams: { texto: text} });

	}

	onClick(event) {
		if (!this._eref.nativeElement.contains(event.target)){
			jQuery('.search-result').css('visibility', 'hidden');
	   }else{
			jQuery('.search-result').css('visibility', 'visible');
	   }
	}
}
