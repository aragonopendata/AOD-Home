export class Topic {

    id: string;
    name: string;
    image_url: string;
    title: string;
    description: string;
    packages: number;

    constructor(id: string, name: string, image_url: string, title: string, description: string, packages: number) {
        this.id = id;
        this.name = name;
        this.image_url = image_url;
        this.title = title;
        this.description = description;
        this.packages = packages;
    }

    public formatImageUrl(image_url: string) {
        let myFormatImageUrl = image_url.slice(14,image_url.length-4);
        return myFormatImageUrl;
    }
}
