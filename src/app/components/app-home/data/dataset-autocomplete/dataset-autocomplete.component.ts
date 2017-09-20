import { Component, OnInit, HostListener } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { DatasetService } from "../../../../services/dataset/dataset.service";
import { Dataset } from "../../../../models/Dataset";
import { Autocomplete } from "../../../../models/Autocomplete";

@Component({
  selector: 'dataset-autocomplete',
  templateUrl: './dataset-autocomplete.component.html',
  styleUrls: ['./../../global-home/global-home.component.css'],
  providers: [DatasetService]
})
export class DataSetAutocompleteComponent implements OnInit {

  dataset: Dataset;
  datasetAutocomplete: Observable<Autocomplete[]>;
  private datasetTitle = new Subject<string>();
  show: boolean;

  constructor(
    private datasetAutocompleteService: DatasetService,
    private router: Router) { }


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
      ? this.datasetAutocompleteService.getDatasetAutocomplete(title)
      : Observable.of<Autocomplete[]>([]))
    .catch(error => {
      console.log(error);
      return Observable.of<Autocomplete[]>([]);
    }).subscribe(data => {
      if (data != "") {
        this.datasetAutocomplete = JSON.parse(data).result;
        this.show = true;
      } else {
        this.show = false;
      }
    });
  }
  //Redirecciona pero no linkea el dataset.
  showDataset(name: string) {
    this.datasetAutocompleteService.getDatasetByName(name);    
  }
}