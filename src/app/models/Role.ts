import {User} from './User';

export class Role {
    roleName: string = '';
    description: string = '';
    assignedUsers: User[];

    constructor(roleName: string, description: string, assignedUsers: User[]) {
        this.roleName = roleName;
        this.description = description;
        this.assignedUsers = assignedUsers;
    }
}