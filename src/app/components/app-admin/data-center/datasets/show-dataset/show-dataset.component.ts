import { Component, OnInit} from '@angular/core';
import {Dataset} from '../../../../../models/Dataset';
import {DatasetService} from '../../../../../services/dataset/dataset.service';

@Component({
  selector: 'app-show-dataset',
  templateUrl: './show-dataset.component.html',
  styleUrls: ['./show-dataset.component.css']
})
export class ShowDatasetComponent implements OnInit {

  dataset: Dataset;

  constructor(private datasetService: DatasetService) { }

  ngOnInit() {
    this.dataset = this.datasetService.getDataset();
  }

}
