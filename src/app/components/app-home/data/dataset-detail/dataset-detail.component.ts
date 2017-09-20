import { Component, OnInit } from '@angular/core';
import { DatasetService } from "../../../../services/dataset/dataset.service";
import { Dataset } from "../../../../models/Dataset";

@Component({
  selector: 'app-dataset-detail',
  templateUrl: './dataset-detail.component.html',
  styleUrls: ['./dataset-detail.component.css']
})
export class DatasetDetailComponent implements OnInit {

  dataset: Dataset = null;
  extraDictionary: string;
  extraDictionaryURL: string[];
  extraDataQuality: string;
  extraFrequency: string;
  extraGranularity: string;
  extraTemporalFrom: string;
  extraTemporalUntil: string;
  extraUriAragopedia: string;
  extraTypeAragopedia: string;
  extraShortUriAragopedia: string;
  extraNameAragopedia: string;

  constructor(private datasetService: DatasetService) { }

  ngOnInit() {
    this.dataset = this.datasetService.getDataset();
    this.getExtras();
  }

  getExtras() {
    this.extraDictionaryURL = [];
    for (var index = 0; index < this.dataset.extras.length; index++) {
      if(this.dataset.extras[index].key.indexOf('Data Dictionary URL') == 0){
        this.extraDictionaryURL.push(this.dataset.extras[index].value);
      }
      switch (this.dataset.extras[index].key) {
        case 'Data Dictionary':
          this.extraDictionary = this.dataset.extras[index].value;
          break;
        case 'Data Quality':
          this.extraDataQuality = this.dataset.extras[index].value;
          break;
        case 'Frequency':
          this.extraFrequency = this.dataset.extras[index].value;
          break;
        case 'Granularity':
          this.extraGranularity = this.dataset.extras[index].value;
          break;
        case 'TemporalFrom':
          this.extraTemporalFrom = this.dataset.extras[index].value;
          break;
        case 'TemporalUntil':
          this.extraTemporalUntil = this.dataset.extras[index].value;
          break;
        case 'nameAragopedia':
          this.extraNameAragopedia = this.dataset.extras[index].value;
          break;
        case 'shortUriAragopedia':
          this.extraShortUriAragopedia = this.dataset.extras[index].value;
          break;
        case 'typeAragopedia':
          this.extraTypeAragopedia = this.dataset.extras[index].value;
          break;
        case 'uriAragopedia':
          this.extraUriAragopedia = this.dataset.extras[index].value;
          break;
      }

    }
  }

}
