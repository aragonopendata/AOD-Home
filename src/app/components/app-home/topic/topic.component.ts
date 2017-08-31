import { Component, OnInit } from '@angular/core';
import { TopicService } from "../../../services/topic/topic.service";
import { Topic } from "../../../models/Topic";
import { SelectItem } from "primeng/primeng";
import { Router } from "@angular/router";

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit {

  topics: any[];
  topic: Topic;
  hovers: any[] = [];

  constructor(private topicService: TopicService) { 
    this.topics = [];
  }

  ngOnInit() {
    this.getTopics();
    this.setHovers(this.topics);
  }

  setHovers(topics: Topic[]) {
    for(let top of topics) {
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
  }
  
  getTopics(): void {
    this.topicService.getTopics().subscribe(topics => {
      this.topics = JSON.parse(topics).result;
      this.setHovers(this.topics);
    });
  }

}
