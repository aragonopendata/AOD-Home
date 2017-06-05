import { Component, OnInit } from '@angular/core';
import {User} from '../../../../models/User';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  displayDialog: boolean;
  disabled: boolean;

  users: User[];

  user: User;

  es: any;

  constructor() {
    this.users = [
      new User("username01", "Administrador total", new Date, true),
      new User("username02", "Administrador", new Date, false)
    ];
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
    this.displayDialog = true;
  }

  showDialog(user, disabled) {
    this.user = this.cloneUser(user);
    this.displayDialog = true;
    this.disabled = disabled;
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
    this.displayDialog = false;
  }

  enableEdition() {
    this.disabled = !this.disabled;
    console.log(this.disabled);
  }
}
