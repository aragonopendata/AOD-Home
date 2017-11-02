import { Component, OnInit } from '@angular/core';
import { Role } from '../../../../models/Role';
import { User } from '../../../../models/User';

@Component({
	selector: 'app-roles-admin',
	templateUrl: './roles-admin.component.html',
	styleUrls: ['./roles-admin.component.css']
})
export class RolesAdminComponent implements OnInit {

	displayDialog: boolean;
	displayUsers: boolean = false;
	displayDialogEdit: boolean;

	users: User[] = [];
	roles: Role[] = [];

	role: Role = new Role();

	constructor() {
		this.users = [];
		this.roles = [];
	}

	ngOnInit() {
	}

	showUsers(role) {
		this.role = role;
		console.log(this.role);
		this.displayUsers = true;
	}

	showDialogToAdd() {
		this.role = new Role();
		this.displayDialogEdit = true;
	}

	showDialog(role, edit) {
		this.role = this.cloneRole(role);
		if (edit) {
			this.displayDialogEdit = true;
		} else {
			this.displayDialog = true;
		}
	}

	cloneRole(r: Role): Role {
		let role = new Role();
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
