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

  datasets: Dataset[] = [];
  dataset: Dataset;
  topics: Topic[];
  topic: Topic = null;
  temas: SelectItem[] = [];
  selectedTopic: String = null;

  constructor(private datasetService: DatasetService, private topicService: TopicService, private router: Router) { }

  ngOnInit() {
    this.datasets = this.datasetService.getDatasets();
    this.topics = this.topicService.getTopics();
    this.topic = this.topicService.getTopic();
    if(this.topic != null) {
      this.selectedTopic = this.topic.name;
    }
    this.setTopics(this.topics);
  }

  showDataset(dataset: Dataset) {
    this.datasetService.setDataset(dataset);
  }

  addDataset() {
    this.dataset = new Dataset('','','',new Topic(23,'',''), new Date, new Publicador('', 0));
    this.datasetService.setDataset(this.dataset);
  }

  setTopics(topics: Topic[]) {
    for( let i = 0; i < topics.length; i++) {
      this.temas.push({label: topics[i].name, value: topics[i].name});
    }
  }

}
