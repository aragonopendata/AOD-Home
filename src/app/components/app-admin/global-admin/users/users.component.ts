import { Component, OnInit } from '@angular/core';
import {User} from '../../../../models/User';
import {Role} from '../../../../models/Role';
import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  displayDialog: boolean;
  displayDialogEdit: boolean;

  users: User[];
  roles: Role[];
  selectRoles: SelectItem[] = [];

  user: User;
  selectedRole: Role;

  date: Date;

  es: any;

  constructor() {
    this.date = new Date;
    this.users = [
      new User("username01", "Administrador total", this.date, true),
      new User("username02", "Administrador de organizaciones", this.date, false),
      new User("username03", "Wacher", this.date, true)
    ];
    this.roles = [
      new Role("Administrador total", "", null),
      new Role("Administrador de organizaciones", "", null),
      new Role("Watcher", "", null)
    ];
    this.selectRoles.push({label: 'Selecciona un rol', value: null});
    for(let i = 0; i < this.roles.length; i++) {
      this.selectRoles.push({label: this.roles[i].roleName, value: this.roles[i].roleName});
    }
  }

  ngOnInit() {
    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ "domingo", "lunes","martes","miércoles","jueves","viernes","sábado" ],
      dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
      monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ]
    };
  }

  showDialogToAdd() {
    this.user = new User("", "", null, false);
    this.displayDialogEdit = true;
  }

  showDialog(user, edit) {
    if(edit) {
      this.user = this.cloneUser(user);
      this.displayDialogEdit = true;
    }else {
      this.user = this.cloneUser(user);
      this.displayDialog = true;
    }
  }

  cloneUser(u: User): User {
    let user = new User("", "", null, false);
    for (let prop in u) {
      user[prop] = u[prop];
    }
    return user;
  }

  save() {
    let users = [...this.users];
    users.push(this.user);
    this.users = users;
    this.user = null;
    this.displayDialogEdit = false;
  }

  enableEdition() {
    this.displayDialogEdit = !this.displayDialogEdit;
    this.displayDialog = !this.displayDialog;
  }
}
