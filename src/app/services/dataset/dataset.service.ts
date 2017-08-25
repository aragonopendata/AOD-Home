import { Injectable } from '@angular/core';
import {Dataset} from '../../models/Dataset';
import {Topic} from '../../models/Topic';
import {TopicService} from '../topic/topic.service';
import {PublicadorService} from '../publicador/publicador.service';
import {Publicador} from '../../models/Publicador';
import {Http, Response, Headers, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Rx";

@Injectable()
export class DatasetService {

  private actionUrl: string;
  private headers: Headers;

  private datasets: Observable<Dataset[]>;
  private dataset: Dataset;
  topics: Observable<Topic[]>;
  publicadores: Publicador[];

  constructor(private topicService: TopicService, private publicadorService: PublicadorService, private http: Http) {

    /*this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');*/

    this.topics = this.topicService.getTopics();
    this.publicadores = this.publicadorService.getPublicadores();
  }

  public getDatasets(rows: number, page: number) {
      return this.http.get('/api/datasets/page/' + page.toString() + '/rows/' + rows.toString()).map(res => res.json());
  }

  setDataset(dataset: Dataset) {
    this.dataset = dataset;
  }

  getDataset() {
    return this.dataset;
  }

  addToCollection(dataset: Dataset) {
    /*if (this.datasets.indexOf(dataset) !== -1) {
      return;
    }
    this.datasets.push(dataset);*/
  }

  removeDataset(dataset: Dataset) {
    //this.datasets.splice(this.datasets.indexOf(dataset), 1);
  }

   private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
