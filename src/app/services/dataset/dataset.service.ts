import { Injectable } from '@angular/core';
import {Dataset} from '../../models/Dataset';
import {Topic} from '../../models/Topic';
import {TopicService} from '../topic/topic.service';
import {PublicadorService} from '../publicador/publicador.service';
import {Publicador} from '../../models/Publicador';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Configuration } from "../../app.constants";
import { Observable } from "rxjs/Rx";

@Injectable()
export class DatasetService {

  private actionUrl: string;
  private headers: Headers;

  private datasets: Dataset[];
  private dataset: Dataset;
  topics: Topic [];
  publicadores: Publicador[];

  constructor(private topicService: TopicService, private publicadorService: PublicadorService, private http: Http,
   private config: Configuration) {

    this.actionUrl = config.completeUrl + config.getDtset;
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');


    //this.datasets = this.getDatasets();
    this.topics = this.topicService.getTopics();
    this.publicadores = this.publicadorService.getPublicadores();
  }

  public getDatasets = (): Observable<Dataset[]> => {
      return this.http.get('/api/ckanDatasets')
      .map((response: Response) => <Dataset[]>response.json())
      .catch(this.handleError);
  }

  setDataset(dataset: Dataset) {
    this.dataset = dataset;
  }

  getDataset() {
    return this.dataset;
  }

  addToCollection(dataset: Dataset) {
    if (this.datasets.indexOf(dataset) !== -1) {
      return;
    }
    this.datasets.push(dataset);
  }

  removeDataset(dataset: Dataset) {
    this.datasets.splice(this.datasets.indexOf(dataset), 1);
  }

   private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
