import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Constants } from '../../../../app.constants';
import { DatasetsService } from '../../../../services/web/datasets.service';
import { Dataset } from '../../../../models/Dataset';
import { Autocomplete } from '../../../../models/Autocomplete';

@Component({
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
	show: boolean;
	//Dynamic URL build parameters
    routerLinkDataCatalog: string;
    routerLinkDataCatalogDataset: string;

	constructor(private datasetService: DatasetsService, private router: Router) {
		this.resultsLimit = Constants.DATASET_AUTOCOMPLETE_LIMIT_RESULTS;
		this.routerLinkDataCatalog = Constants.ROUTER_LINK_DATA_CATALOG;
		this.routerLinkDataCatalogDataset = Constants.ROUTER_LINK_DATA_CATALOG_DATASET;
		this.show = true;
	}

	ngOnInit(): void {
		this.getAutocomplete();
	}

	search(title: string): void {
		//Lectura cuando hay al menos 3 caracteres, (3 espacios produce error).
		if (title.length >= Constants.DATASET_AUTOCOMPLETE_MIN_CHARS) {
			this.datasetTitle.next(title);
		} else {
			this.datasetAutocomplete = null;
		}
	}

	getAutocomplete(): void {
		//Funciona la busqueda, falla al poner un caracter especial
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
}
