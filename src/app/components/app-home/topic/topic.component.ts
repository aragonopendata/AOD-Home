import { Component, OnInit } from '@angular/core';
import { TopicService } from "../../../services/topic/topic.service";
import { Topic } from "../../../models/Topic";
import { SelectItem } from "primeng/primeng";
import { Router } from "@angular/router";
import {Location} from '@angular/common';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit {

  topics: Topic[];
  topic: Topic;
  hovers: any[] = [];

  constructor(private topicService: TopicService, private location: Location) { 
  }

  ngOnInit() {
    this.getTopics();
  }

  setHovers() {
    for(let top of this.topics) {
      this.hovers.push({ label: top.title, hover: false });
    }
  }

  setHover(name, index) {
    for (let hover of this.hovers){
      if(hover.label === name) {
        hover.hover = !hover.hover;
      }
    }
  }

  unsetHover(name, index) {
    for (let hover of this.hovers){
      if(hover.label === name) {
        hover.hover = !hover.hover;
      }
    }
  }

  setTopic(topic) {
    this.topicService.setTopic(topic);
    this.location.replaceState("/home/data/topic/"+topic.name);
  }
  
  getTopics(): void {
    this.topicService.getTopics().subscribe(topics => {
      this.topics = JSON.parse(topics).result;
      this.setHovers();
    });
  }

}
