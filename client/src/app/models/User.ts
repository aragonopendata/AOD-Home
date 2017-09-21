export class User {
    id: string;
    name: string;
    email: string;
    username: string = '';
    role: string = '';
    singupDate: Date = null;
    active: boolean = false;
    sysadmin: boolean;

    constructor(username: string, role: string, singupDate: Date, active: boolean, id: string, name: string, email: string, sysadmin: boolean) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.username = username;
        this.role = role;
        this.singupDate = singupDate;
        this.active = active;
        this.sysadmin = sysadmin;
    }
}