export class OrgUser {

    id: string;
    name: string;
    email: string;
    sysadmin: boolean;

    constructor(id: string, name: string, email: string, sysadmin: boolean) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.sysadmin = sysadmin;
    }
}