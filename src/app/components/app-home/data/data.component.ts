import { Component, OnInit, Input } from '@angular/core';
import { DatasetService } from "../../../services/dataset/dataset.service";
import { Dataset } from "../../../models/Dataset";
import { Topic } from "../../../models/Topic";
import { Publicador } from "../../../models/Publicador";
import { TopicService } from "../../../services/topic/topic.service";
import { SelectItem } from "primeng/primeng";
import {DropdownModule} from 'primeng/primeng';
import { Router } from "@angular/router";
import { TopicComponent } from '../topic/topic.component';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  
  selectedTopic: string;
  datasets: any[];
  dataset: Dataset;
  numDatasets: number;
  topics: any[];
  // topic: Topic;
  topicsSelect: SelectItem[] = [];
  //selectedTopic: String = null;

  constructor(private datasetService: DatasetService, private topicService: TopicService, private router: Router) {
    this.datasets = [];
    this.topics = [];
  }

  ngOnInit() {
    this.getSelectedTopic();
    if (this.selectedTopic === undefined) {
      this.getDatasets();
    } else {
      this.getDatasetsByTopic(this.selectedTopic);
    }
    this.setTopics(this.topics);
  }

  getSelectedTopic(){
    if(this.topicService.getTopic() === undefined){
      
    }else{
      this.selectedTopic = this.topicService.getTopic().name;
    }
  }

  showDataset(dataset: Dataset) {
    this.datasetService.setDataset(dataset);
  }

  addDataset() {
    this.dataset = new Dataset();
    this.datasetService.setDataset(this.dataset);
  }

  setTopics(topics: Topic[]) {
    this.topicsSelect.push({ label: 'Seleccione tema', value: null });
    for(let top of topics) {
      this.topicsSelect.push({ label: top.title, value: top.name });
    }
  }

  paginate(event) {
    if (this.selectedTopic === undefined) {
      this.datasetService.getDatasets(event.rows, event.page).subscribe(datasets => {
        this.datasets = JSON.parse(datasets).result.results;
        this.numDatasets = JSON.parse(datasets).result.count;
      });
    }else{
      this.datasetService.getDatasetsByTopic(this.selectedTopic, event.rows, event.page).subscribe(datasets => {
        this.datasets = JSON.parse(datasets).result;        
        this.numDatasets = JSON.parse(datasets).result;
      });
  }
    document.body.scrollTop = 0;
  }

  getDatasets(): void {
    this.datasetService.getDatasets(20, 0).subscribe(datasets => {
      this.datasets = JSON.parse(datasets).result.results;
      this.numDatasets = JSON.parse(datasets).result.count;
    });
  }

  getDatasetsByTopic(topic: String): void {
    this.datasetService.getDatasetsByTopic(topic,20,0).subscribe(datasets => {
      this.datasets = JSON.parse(datasets).result;
      this.numDatasets = JSON.parse(datasets).result.count;
    });
  }
}
