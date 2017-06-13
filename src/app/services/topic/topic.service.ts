import { Injectable } from '@angular/core';
import {Topic} from '../../models/Topic';

@Injectable()
export class TopicService {

  private topics: Topic[];
  private topic: Topic;

  constructor() {
    this.topics = [
        new Topic(1, "Ciencia y tecnología"),
        new Topic(2, "Comercio"),
        new Topic(3, "Cultura y ocio"),
        new Topic(4, "Demografía"),
        new Topic(5, "Deporte"),
        new Topic(6, "Economía"),
        new Topic(7, "Educación"),
        new Topic(8, "Empleo"),
        new Topic(9, "Energía")
    ];
  }

  getTopics() {
    return this.topics;
  }
}
