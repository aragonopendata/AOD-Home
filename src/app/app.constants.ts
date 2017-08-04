import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {

    /*General request configuration*/
    public serverUrl: string = 'http://opendata.aragon.es/';
    public apiUrl: string = 'datos/api/action/';
    public completeUrl: string = this.serverUrl + this.apiUrl;
    
    /*Specific request configuration*/
    /*DATASETS*/
    /*Get all datasets*/
    public getDtset: string = 'package_search/';
}