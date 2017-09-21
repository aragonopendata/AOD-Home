import { Extra } from './Extra';
import { User } from './User';

export class Organization {

    id: string;
    name: string;
    image_url: string;
    title: string;
    description: string;
    packages: number;
    extras: Extra[];
    users: User[];

    constructor() {
    }
}