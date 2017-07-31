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

  constructor(private datasetService: DatasetService) {  }

  ngOnInit() {
    this.dataset = this.datasetService.getDataset();
  }

}
