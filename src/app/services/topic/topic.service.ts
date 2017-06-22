import { Injectable } from '@angular/core';
import {Topic} from '../../models/Topic';

@Injectable()
export class TopicService {

  private topics: Topic[];
  private topic: Topic;

  constructor() {
    this.topics = [
        new Topic(1, "Ciencia y tecnología", "01-Ciencia"),
        new Topic(2, "Comercio", "02-Comercio"),
        new Topic(3, "Cultura y ocio", "03-Cultura"),
        new Topic(4, "Demografía", "04-Demografia"),
        new Topic(5, "Deporte", "05-Deporte"),
        new Topic(6, "Economía", "06-Economia"),
        new Topic(7, "Educación", "07-Educacion"),
        new Topic(8, "Empleo", "08-Empleo"),
        new Topic(9, "Energía", "09-Energia")
    ];
  }

  getTopics() {
    return this.topics;
  }
}
