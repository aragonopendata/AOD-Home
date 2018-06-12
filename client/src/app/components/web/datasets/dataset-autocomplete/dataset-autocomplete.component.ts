import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable ,  Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Constants } from '../../../../app.constants';
import { DatasetsService } from '../../../../services/web/datasets.service';
import { Dataset } from '../../../../models/Dataset';
import { Autocomplete } from '../../../../models/Autocomplete';
import { HeaderComponent } from '../../common/header/header.component';
declare var jQuery:any;
import { UtilsService } from '../../../../services/web/utils.service';

@Component({
	host: {'(document:click)': 'onClick($event)'},
	selector: 'dataset-autocomplete',
	templateUrl: './dataset-autocomplete.component.html',
	styleUrls: ['./dataset-autocomplete.component.css'],
	providers: [DatasetsService]
})

export class DatasetAutocompleteComponent implements OnInit {

	openedMenu: boolean;

	dataset: Dataset;
	datasetAutocomplete: Autocomplete[];
	datasets: Autocomplete[];
	private datasetTitle = new Subject<string>();
	private resultsLimit: number;
	//Dynamic URL build parameters
    routerLinkDataCatalog: string;
	routerLinkDataCatalogDataset: string;
	resultsExtended: boolean;
	text: string;

	constructor(private datasetService: DatasetsService, private router: Router,
		private _eref: ElementRef, private utilsService: UtilsService) {
		this.resultsLimit = Constants.DATASET_AUTOCOMPLETE_LIMIT_RESULTS;
		this.routerLinkDataCatalog = Constants.ROUTER_LINK_DATA_CATALOG;
		this.routerLinkDataCatalogDataset = Constants.ROUTER_LINK_DATA_CATALOG_DATASET;
		this.getOpenedMenu();
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
					this.datasets = this.datasetAutocomplete;
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
			if(this.datasetAutocomplete)
				this.datasets = this.datasetAutocomplete;
			this.datasetAutocomplete = null;
			//jQuery('.search-result').css('visibility', 'hidden');
	   }else{
		   if(!this.datasetAutocomplete)
				this.datasetAutocomplete = this.datasets;
			//jQuery('.search-result').css('visibility', 'visible');
	   }
	}

    getOpenedMenu(){
        this.utilsService.openedMenuChange.subscribe(value => {
			this.openedMenu = value;
		});
    }
}
