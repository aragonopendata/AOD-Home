import { Component, OnInit } from '@angular/core';
import { DatasetService } from "../../../services/dataset/dataset.service";
import { Dataset } from "../../../models/Dataset";
import { Topic } from "../../../models/Topic";
import { Publicador } from "../../../models/Publicador";
import { TopicService } from "../../../services/topic/topic.service";
import { SelectItem } from "primeng/primeng";
import { Router } from "@angular/router";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  datasets: any[];
  dataset: Dataset;
  numDatasets: number;
  topics: Topic[];
  topic: Topic = null;
  temas: SelectItem[] = [];
  selectedTopic: String = null;

  constructor(private datasetService: DatasetService, private topicService: TopicService, private router: Router) {
    this.datasets = [];
  }

  ngOnInit() {
    this.getDatasets();
  }

  showDataset(dataset: Dataset) {
    this.datasetService.setDataset(dataset);
  }

  addDataset() {
    this.dataset = new Dataset();
    this.datasetService.setDataset(this.dataset);
  }

  setTopics(topics: Topic[]) {
    for( let i = 0; i < topics.length; i++) {
      this.temas.push({label: topics[i].name, value: topics[i].name});
    }
  }

  paginate(event) {
    this.datasetService.getDatasets(event.rows, event.page).subscribe(datasets => {
      this.datasets = JSON.parse(datasets).result.results;
      this.numDatasets = JSON.parse(datasets).result.count;
    });
    document.body.scrollTop = 0;
  }

  getDatasets(): void {
    this.datasetService.getDatasets(20, 0).subscribe(datasets => {
      this.datasets = JSON.parse(datasets).result.results;
      this.numDatasets = JSON.parse(datasets).result.count;
    });
  }
}
