import { Injectable } from '@angular/core';
import {Topic} from '../../models/Topic';
import {Http, Response, Headers, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Rx";

@Injectable()
export class TopicService {

  private topics: Observable<Topic[]>;
  private topic: Topic;
  
  constructor(private http: Http) {
    
  }

  public getTopics(){
   return this.http.get('/aod/api/topics').map(res => res.json());
  }

  setTopic(topic: Topic) {
    this.topic = topic;
  }

  getTopic() {
    return this.topic;
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
}
}
