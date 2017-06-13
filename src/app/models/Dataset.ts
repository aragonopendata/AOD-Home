import {Topic} from './Topic';
import {SelectItem} from 'primeng/primeng';
import {Publicador} from './Publicador';
export class Dataset {

    name: string;
    url: string;
    description: string;
    topic: Topic;
    coberturaGeo: string;
    coberturaTmp: Date;
    fromDate: Date;
    untilDate: Date;
    languaje: string;
    firstPublish: Date;
    lastUpdate: Date;
    updateFrequency: SelectItem[];
    publicador: Publicador;
    dataFiles: string[];
    checked: boolean;

    constructor(name: string, url: string, description: string, topic: Topic, lastUpdate: Date, publicador: Publicador) {
        this.name = name;
        this.url = url;
        this.description = description;
        this.topic = topic;
        this.lastUpdate = lastUpdate;
        this.publicador = publicador;
        this.untilDate = new Date;
    }
}
