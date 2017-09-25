export class User {
    about: string;
    capacity: string;
    created: Date;
    activity_streams_email_notifications: boolean;
    email_hash: string;
    number_of_edits: number;
    number_administered_packages: number;
    display_name: string;
    fullname: string;
    id: string;
    openid: string;
    name: string;
    email: string;
    //ADMIN
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