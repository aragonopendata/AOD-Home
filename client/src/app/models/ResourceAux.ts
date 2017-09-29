export class ResourceAux {
    name: string;
    sources: string[];
    formats: string[];

    constructor() {
   
    }

    getSourcesSize(){
        return this.sources.length;
    }
}