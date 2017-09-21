import { Extra } from './Extra';
import { User } from './User';

export class OrganizationAdmin {

    id: string;
    name: string;
    image_url: string;
    title: string;
    description: string;
    packages: number;
    extras: Extra[];
    users: User[];

    constructor(id: string, name: string, image_url: string, title: string, description: string, packages: number, extras: Extra[], users: User[]) {
        this.id = id;
        this.name = name;
        this.image_url = image_url;
        this.title = title;
        this.description = description;
        this.packages = packages;
        this.extras = extras;
        this.users = users;
    }
}