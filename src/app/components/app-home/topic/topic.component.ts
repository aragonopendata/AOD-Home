import { Component, OnInit } from '@angular/core';
import { TopicService } from "../../../services/topic/topic.service";
import { Topic } from "../../../models/Topic";

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit {

  topics: Topic[] = [];
  hovers: any[] = [];

  constructor(private topicService: TopicService) { }

  ngOnInit() {
    this.topics = this.topicService.getTopics();
    this.setHovers(this.topics);
  }

  setHovers(topics: Topic[]) {
    for(let top of topics) {
      this.hovers.push({ label: top.name, hover: false });
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

}
