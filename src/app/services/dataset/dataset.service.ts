import { Injectable } from '@angular/core';
import { Dataset } from '../../models/Dataset';
import { Topic } from '../../models/Topic';
import { TopicService } from '../topic/topic.service';
import { PublicadorService } from '../publicador/publicador.service';
import { Publicador } from '../../models/Publicador';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Rx";

@Injectable()
export class DatasetService {

  private actionUrl: string;
  private headers: Headers;

  private datasetsDetail: Dataset[];
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

  //TODO: linkee el dataset al del servicio.
  public getDatasetByName(name: string) {
    this.http.get('/aod/api/datasets/byname/' + name).map(res => res.json()).subscribe(data => {
      //this.datasetsDetail = JSON.parse(data).result.results as Dataset[];
    });
  }

  public getDatasets(sort: string, rows: number, page: number) {
    return this.http.get('/aod/api/datasets?sort=' + sort + '&page=' + page.toString() + '&rows=' + rows.toString()).map(res => res.json());
  }

  public getDatasetsByTopic(sort: string, topic: String, rows: number, page: number) {
    return this.http.get('/aod/api/datasets/topic/' + topic.toString() + '?sort=' + sort + '&page=' + page.toString() + '&rows=' + rows.toString()).map(res => res.json());
  }

  public getDatasetsByOrganization(organization: String, rows: number, page: number) {
    return this.http.get('/aod/api/datasets/organization/' + organization.toString() + '/page/' + page.toString() + '/rows/' + rows.toString()).map(res => res.json());
  }

  public getDatasetAutocomplete(name: string) {
    return this.http.get('/aod/api/datasets/name/' + name).map(res => res.json());
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
