import { Component, OnInit } from '@angular/core';
import { DatasetService } from "../../../services/dataset/dataset.service";
import { Dataset } from "../../../models/Dataset";
import { Topic } from "../../../models/Topic";
import { Publicador } from "../../../models/Publicador";
import { TopicService } from "../../../services/topic/topic.service";
import { SelectItem } from "primeng/primeng";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  datasets: Dataset[] = [];
  dataset: Dataset;
  topics: Topic[];
  temas: SelectItem[] = [];

  constructor(private datasetService: DatasetService, private topicService: TopicService) { }

  ngOnInit() {
    this.datasets = this.datasetService.getDatasets();
    this.topics = this.topicService.getTopics();
    this.setTopics(this.topics);
  }

  onRowSelect(event) {
    this.showDataset(event.data);
  }

  showDataset(dataset: Dataset) {
    this.datasetService.setDataset(dataset);
  }

  addDataset() {
    this.dataset = new Dataset('','','',new Topic(23,'',''), new Date, new Publicador(''));
    this.datasetService.setDataset(this.dataset);
  }

  setTopics(topics: Topic[]) {
    for( let i = 0; i < topics.length; i++) {
      this.temas.push({label: topics[i].name, value: topics[i].name});
    }
  }

}
