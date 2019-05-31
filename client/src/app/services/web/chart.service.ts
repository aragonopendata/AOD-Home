import { Injectable } from '@angular/core';
import { Constants } from '../../app.constants';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map'

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: Http) { }

  public getCharts(pages, sizeOfPAges) {
    return this.http
      .get(
        Constants.VISUAL_BACK_SERVER_URL +
        Constants.LIST_ALL_CHARTS_PATH +
        '/?page=' +
        pages +
        '&size=' +
        sizeOfPAges
      )
      .map((res: Response) => res.json())
      .catch(err => {
        return Observable.throw('errorConexion');
      });
  }
}
