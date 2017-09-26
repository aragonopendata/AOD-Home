import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ConstantsService } from '../../../../app.constants';
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

	constructor(private datasetService: DatasetsService, private router: Router, private constants: ConstantsService) {
		this.resultsLimit = constants.DATASET_AUTOCOMPLETE_LIMIT_RESULTS;
		this.show = true;
	}

	ngOnInit(): void {
		this.getAutocomplete();
	}

	search(title: string): void {
		//Lectura cuando hay al menos 3 caracteres, (3 espacios produce error).
		if (title.length >= 3) {
			this.datasetTitle.next(title);
		} else {
			this.datasetAutocomplete = null;
		}
	}

	getAutocomplete(): void {
		//Funciona la busqueda, falla al poner un caracter especial
		this.datasetTitle
			.debounceTime(50)
			.distinctUntilChanged()
			.switchMap(title => title
				? this.datasetService.getDatasetsAutocomplete(title, this.resultsLimit)
				: Observable.of<Autocomplete[]>([]))
			.catch(error => {
				console.log(error);
				return Observable.of<Autocomplete[]>([]);
			}).subscribe(data =>
				this.datasetAutocomplete = JSON.parse(data).result);
	}

	hideList(){
		this.show = false;
	}
}
