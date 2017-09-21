import { SelectItem } from 'primeng/primeng';
import { Topic } from './Topic';
import { Organization } from './Organization';

export class Extras {
    
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
    lastUpdate: string;
    updateFrequency: SelectItem[];
    organization: Organization;
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
