export class Topic {

    id: number;
    name: string;
    imageName: string;

    constructor(id: number, name: string, imageName: string) {
        this.name = name;
        this.id = id;
        this.imageName = imageName;
    }
}
