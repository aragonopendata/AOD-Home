import { Component, OnInit, Input } from '@angular/core';
import { DatasetService } from "../../../services/dataset/dataset.service";
import { Dataset } from "../../../models/Dataset";
import { Topic } from "../../../models/Topic";
import { Publicador } from "../../../models/Publicador";
import { TopicService } from "../../../services/topic/topic.service";
import { SelectItem } from "primeng/primeng";
import {DropdownModule} from 'primeng/primeng';
import { Router } from "@angular/router";
import {Location} from '@angular/common';
import { TopicComponent } from '../topic/topic.component';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  
  selectedTopic: string;
  datasets: Dataset[];
  dataset: Dataset;
  numDatasets: number;

  @Input() topics: Topic[];
   topic: Topic;
  topicsSelect: SelectItem[];
  datasetTypes: SelectItem[];

  constructor(private datasetService: DatasetService, private topicService: TopicService, private router: Router, private location: Location) {
  }

  ngOnInit() {  
    this.loadDatasets();  
    this.setTopicsDropdown();
    this.setDatsetTypeDropdown();
  }

  loadDatasets(){
    this.datasets = [];
    if (this.selectedTopic === undefined) {
      this.getDatasets();
    } else {
      this.getDatasetsByTopic(this.selectedTopic);
    } 
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

  setTopicsDropdown() {
      this.topicsSelect = [];
      this.topicService.getTopics().subscribe(topics => {
        this.topics = JSON.parse(topics).result;
        for (let top of this.topics) {
          this.topicsSelect.push({ label: top.title, value: top.name });
        }
      });
      this.getSelectedTopic();
  }

  setDatsetTypeDropdown() {
    this.datasetTypes = [];
        this.datasetTypes.push({ label: 'Calendario', value: 'Calendario' });
        this.datasetTypes.push({ label: 'Fotos', value: 'Fotos' });
        this.datasetTypes.push({ label: 'Hojas de Calculo', value: 'Hojas de Calculo' });
        this.datasetTypes.push({ label: 'Mapas', value: 'Mapas' });
        this.datasetTypes.push({ label: 'Recursos Educativos', value: 'Recursos Educativos' });
        this.datasetTypes.push({ label: 'Recursos Web', value: 'Recursos Web' });
        this.datasetTypes.push({ label: 'RSS', value: 'RSS' });
        this.datasetTypes.push({ label: 'Texto plano', value: 'Texto plano' });
}

  setTopicData(){
    this.loadDatasets();
    this.location.replaceState("/home/data/topic/"+this.selectedTopic);
  }

  paginate(event) {
    if (this.selectedTopic === undefined) {
      this.datasetService.getDatasets(event.rows, event.page).subscribe(datasets => {
        this.datasets = JSON.parse(datasets).result.results;
        this.numDatasets = JSON.parse(datasets).result.count;
      });
    }else{
      this.datasetService.getDatasetsByTopic(this.selectedTopic, event.rows, event.page).subscribe(datasets => {
        this.datasets = JSON.parse(datasets).result.results;
        this.numDatasets = JSON.parse(datasets).result.count;
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
      this.datasets = JSON.parse(datasets).result.results;
      this.numDatasets = JSON.parse(datasets).result.count;
    });
  }
}
