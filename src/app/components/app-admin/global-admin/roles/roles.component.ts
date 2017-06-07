import { Component, OnInit } from '@angular/core';
import {Role} from '../../../../models/Role';
import {User} from '../../../../models/User';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  displayDialog: boolean;
  displayUsers: boolean = false;
  displayDialogEdit: boolean;

  users: User[] = [];
  roles: Role[] = [];

  role: Role = new Role("","",null);

  constructor() {
    this.users = [
      new User("username01", "Administrador total", new Date, true),
      new User("username02", "Administrador total", new Date, false),
      new User("username03", "Administrador de organizacion", new Date, true),
      new User("username04", "Administrador de organización", new Date, false),
      new User("username05", "Watcher", new Date, true),
      new User("username06", "Watcher", new Date, false)
    ];
    this.roles = [
        new Role("Administrador total", "Puede editar todo en el portal.", this.users),
        new Role("Administrador de organizacion", "Puede editar sólo datos de su organización.", this.users),
        new Role("Watcher", "Puede visualizar datos privados, pero no editarlos", this.users)
    ];
  }

  ngOnInit() {
  }

  showUsers(role) {
    this.role = role;
    console.log(this.role.assignedUsers);
    this.displayUsers = true;
  }

  showDialogToAdd() {
    this.role = new Role("", "", null);
    this.displayDialogEdit = true;
  }

  showDialog(role, edit) {
    this.role = this.cloneRole(role);
    if(edit) {
      this.displayDialogEdit = true;
    }else {
      this.displayDialog = true;
    }
  }

  cloneRole(r: Role): Role {
    let role = new Role("", "", null);
    for (let prop in r) {
      role[prop] = r[prop];
    }
    return role;
  }

  enableEdition() {
    this.displayDialog = !this.displayDialog;
    this.displayDialogEdit = !this.displayDialogEdit;
  }
}
