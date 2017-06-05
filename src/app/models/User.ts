export class User {
    username: string = '';
    role: string = '';
    singupDate: Date = null;
    active: boolean = false;

    constructor(username: string, role: string, singupDate: Date, active: boolean) {
        this.username = username;
        this.role = role;
        this.singupDate = singupDate;
        this.active = active;
    }
}