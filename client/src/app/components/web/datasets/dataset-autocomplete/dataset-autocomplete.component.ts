import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Component, OnInit, HostListener } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
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
	datasetAutocomplete: Observable<Autocomplete[]>;
	private datasetTitle = new Subject<string>();
	show: boolean;
	private resultsLimit: number;

	constructor(private datasetService: DatasetsService, private router: Router, private constants: ConstantsService) { 
		this.resultsLimit = constants.DATASET_AUTOCOMPLETE_LIMIT_RESULTS;
	}

	ngOnInit(): void {
		this.getAutocomplete();
		this.show = true;
	}

	search(title: string): void {
		this.datasetTitle.next(decodeURI(title));
	}

	getAutocomplete(): void {
		//Funciona la busqueda, falla al poner un caracter especial
		this.datasetTitle
			.debounceTime(300)
			.distinctUntilChanged()
			.switchMap(title => title
				? this.datasetService.getDatasetsAutocomplete(title, this.resultsLimit)
				: Observable.of<Autocomplete[]>([]))
			.catch(error => {
				console.log(error);
				return Observable.of<Autocomplete[]>([]);
			}).subscribe(data => {
				if (data != '') {
					this.datasetAutocomplete = JSON.parse(data).result;
					this.show = true;
				} else {
					this.show = false;
				}
			});
	}
	//Redirecciona pero no linkea el dataset.
	showDataset(name: string) {
		//dataset = this.datasetService.getDatasetByName(name);
		this.datasetService.setDataset(this.dataset);
	}
}
