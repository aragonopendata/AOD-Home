import {Extra} from './Extra';
import {OrgUser} from './OrgUser';

export class Org {

    id: string;
    name: string;
    image_url: string;
    title: string;
    description: string;
    packages: number;
    extras: Extra[];
    users: OrgUser[];

    constructor(id: string, name: string, image_url: string, title: string, description: string, packages: number, extras: Extra[], users: OrgUser[]) {
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