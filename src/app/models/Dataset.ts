import {Topic} from './Topic';
import {SelectItem} from 'primeng/primeng';
import {Publicador} from './Publicador';
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
