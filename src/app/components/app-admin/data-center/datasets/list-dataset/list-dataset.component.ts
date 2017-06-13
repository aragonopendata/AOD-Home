import {Component, OnInit} from '@angular/core';
import {Dataset} from '../../../../../models/Dataset';
import {DatasetService} from '../../../../../services/dataset/dataset.service';

@Component({
  selector: 'app-list-dataset',
  templateUrl: './list-dataset.component.html',
  styleUrls: ['./list-dataset.component.css']
})
export class ListDatasetComponent implements OnInit {

  datasets: Dataset[] = [];
  dataset: Dataset;

  constructor(private datasetService: DatasetService) { }

  ngOnInit() {
    this.datasets = this.datasetService.getDatasets();
  }

  showDataset(dataset: Dataset) {
    this.datasetService.setDataset(dataset);
  }
}
