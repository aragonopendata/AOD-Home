export class History {

    id?: string;
    state?:number;
    title?: string;
    description?: string;
    email?:string;
    id_reference?:string;
    main_category?: number;
    secondary_categories?: number[];
    contents?: Content[];

    create_date: Date;
    update_date: string;

    image?: string;
    constructor() { }

    public formatDate(date: Date) {
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        let myFormatDate = day + '/' + month + '/' + year;
        return myFormatDate;
    }
}

export class Content {

    id?: string;
    title?: string;
    description?: string;
    id_Graph?: string;
    urlGraph?:string;

    constructor() {}
}