import {Topic} from './Topic';
import {SelectItem} from 'primeng/primeng';
import {Publicador} from './Publicador';

export class Extras{
    package_id: string;
    value: string;
    revision_timestamp: Date;
    state: string;
    key: string;
    revision_id:string;
    id: string;
}

export class Dataset {

    name: string;
    url: string;
    description: string;
    acessos: number;
    topic: Topic;
    coberturaGeo: string;
    coberturaTmp: Date;
    fromDate: Date;
    untilDate: Date;
    languaje: string;
    firstPublish: Date;
    lastUpdate: String;
    updateFrequency: SelectItem[];
    publicador: Publicador;
    dataFiles: string[];
    checked: boolean;
    title: string;
    extras: Extras[];

    constructor() {
    
    }

    formatDate(date: Date) {
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        let myFormatDate = day + '/' + month + '/' + year;
        return myFormatDate;
    }
}
