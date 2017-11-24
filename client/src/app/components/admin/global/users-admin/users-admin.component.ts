import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SelectItem, MessagesModule, GrowlModule, Message } from 'primeng/primeng';
import { User } from '../../../../models/User';
import { Role } from '../../../../models/Role';
import { UsersAdminService } from '../../../../services/admin/users-admin.service';
import { RolesAdminService } from '../../../../services/admin/roles-admin.service';
import { Constants } from '../../../../app.constants';

@Component({
	selector: 'app-users',
	templateUrl: './users-admin.component.html',
	styleUrls: ['./users-admin.component.css']
})

export class UsersAdminComponent implements OnInit {
	userAdminMessages: Message[] = [];
	userNameDelete: string;
	displayDeleteDialog: boolean = false;
	userIdToDelete: number;

	displayViewDialog: boolean;
	displayEditDialog: boolean;

	users: User[];
	user: User;
	activatedUser: boolean = true;

	role: Role;
	roles: Role[];
	selectedRole: number;
	selectRoles: SelectItem[] = [];

	//Pagination and ordering params
	sort: string;
	pageRows: number;

	constructor(private usersAdminService: UsersAdminService, private rolesAdminService: RolesAdminService, private changeDetectorRef: ChangeDetectorRef) {
		this.pageRows = Constants.ADMIN_USERS_LIST_ROWS_PER_PAGE;
		this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_NAME;
	}

	ngOnInit() {
		this.getUsers(null, null);
		this.getRoles();
	}

	getUsers(page: number, rows: number) {
		this.users = [];
		var pageNumber = (page != null ? page : 0);
		var rowsNumber = (rows != null ? rows : this.pageRows);
		this.usersAdminService.getUsers(this.sort, pageNumber, rowsNumber).subscribe(users => {
			try {
				for (var index = 0; index < users.length; index++) {
					this.user = new User();
					this.user = users[index].user;
					this.users = [...this.users, this.user];
				}
			} catch (error) {
				console.error('Error: getUsers() - users-admin.component.ts');
			}
		});
	}

	getRoles() {
		this.roles = [];
		// this.selectRoles = [];
		// this.selectRoles.push({ label: 'Seleccione un rol', value: null });
		this.rolesAdminService.getRoles().subscribe(roles => {
			try {
				for (var index = 0; index < roles.length; index++) {
					this.role = new Role();
					this.role = roles[index];
					this.roles = [...this.roles, this.role];
					// this.selectRoles.push({ label: this.role.description, value: index });
				}
			} catch (error) {
				console.error('Error: getRoles() - users-admin.component.ts');
			}
		});
	}

	enableEdition() {
		this.displayEditDialog = !this.displayEditDialog;
		this.displayViewDialog = !this.displayViewDialog;
	}

	showDeleteDialog(user) {
		this.user = user;
		this.displayDeleteDialog = true;
	}

	deleteUser() {
		this.usersAdminService.removeUser(this.user).subscribe(res => {
			if (res.success) {
				if (this.userAdminMessages.length > 4){
					this.userAdminMessages = [];
				}
				this.userAdminMessages.push({ severity: 'success', summary: 'Borrado de usuario', detail: 'Usuario borrado correctamente' });
				this.displayDeleteDialog = false;
				this.user = new User();
				this.users = [];
				this.getUsers(null, null);
			} else {
				this.userAdminMessages = [];
				this.userAdminMessages.push({ severity: 'error', summary: 'Borrado de usuario', detail: 'Error al borrar el usuario' });
			}
		});
	}

	undoDeleteUser() {
		this.displayDeleteDialog = false;
		this.user = new User;
	}

	showDialog(user, edit, create) {
		if (edit) {
			this.user = this.cloneUser(user);
			this.selectedRole = this.user.role[0].id;
			this.displayEditDialog = true;
		} else if (create) {
			this.user = new User();
			this.user.role = [new Role()];
			this.selectedRole = undefined;
			this.displayEditDialog = true;
		} else {
			this.user = this.cloneUser(user);
			this.displayViewDialog = true;
		}
	}

	cloneUser(userToClone: User): User {
		let userCloned = new User();
		for (let userProperty in userToClone) {
			userCloned[userProperty] = userToClone[userProperty];
		}
		return userCloned;
	}

	valitadeUserForm() {
		if (this.user.fullname != undefined && this.user.fullname != '' 
				&& this.user.name != undefined && this.user.name != '' 
				&& this.user.email != undefined && this.user.email != '' 
				&& this.user.description != undefined && this.user.description != ''
				&& this.selectedRole != undefined ) {
			this.userAdminMessages = [];
			return true;
		}
	}

	saveUser() {
		if (!this.user.id) {
			this.user.active = this.activatedUser;
			this.user.role = [new Role()];
			this.user.role[0] = this.roles[this.selectedRole - 1];
			if (this.valitadeUserForm()) {
				this.usersAdminService.createUser(this.user).subscribe(result => {
					if (result.status == 200 && result.success ) {
						this.userAdminMessages = [];
						this.userAdminMessages.push({ severity: 'success', summary: 'Alta de usuario', detail: 'Usuario insertado correctamente' });
						this.displayEditDialog = false;
						this.selectedRole = undefined;
						this.user = new User();
						this.users = [];
						this.getUsers(null, null);
					} else {
						this.userAdminMessages = [];
						this.userAdminMessages.push({ severity: 'error', summary: 'Alta de usuario', detail: 'Error al insertar el usuario: ' + result.error + (result.message ? result.message + '.' : '.') });
					}
				});
			} else {
				this.userAdminMessages = [];
				this.userAdminMessages.push({ severity: 'warn', summary: 'Alta de usuario', detail: ' Faltan campos por rellenar del usuario' });
			}
		} else {
			let userUpdated: any = this.user;
			userUpdated.role = this.selectedRole;
			this.usersAdminService.updateUser(userUpdated).subscribe(response => {
				this.userAdminMessages = [];
				if (response.status == 200) {
					this.userAdminMessages.push({ severity: 'success', summary: 'Usuario Actualizado', detail: 'Se ha actualizado el usuario con exito' });
					this.user = new User();
					this.users = [];
					this.getUsers(null, null);
					this.displayEditDialog = false;
				}
				if (response.status == 409) {
					this.userAdminMessages.push({ severity: 'warn', summary: response.errorTitle, detail: response.errorDetail });
				} else if (response.status != 200) {
					this.userAdminMessages.push({ severity: 'warn', summary: response.errorTitle, detail: response.errorDetail });
				}
			});
		}
	}

	blockUI() {

	}

	setOrder(event) {
		event.page = 0;
		switch (event.field) {
			case Constants.ADMIN_USERS_LIST_SORT_COLUMN_NAME:
				this.sort == Constants.ADMIN_USERS_LIST_SORT_COLUMN_NAME
					? this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_NAME + ' DESC'
					: this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_NAME + ' ASC';
				break;
			case Constants.ADMIN_USERS_LIST_SORT_COLUMN_EMAIL:
				this.sort == Constants.ADMIN_USERS_LIST_SORT_COLUMN_EMAIL
					? this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_EMAIL + ' DESC'
					: this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_EMAIL + ' ASC';
				break;
			case Constants.ADMIN_USERS_LIST_SORT_COLUMN_ROLE:
				this.sort == Constants.ADMIN_USERS_LIST_SORT_COLUMN_ROLE
					? this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_ROLE + ' DESC'
					: this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_ROLE + ' ASC';
				break;
			case Constants.ADMIN_USERS_LIST_SORT_COLUMN_ACTIVE:
				this.sort == Constants.ADMIN_USERS_LIST_SORT_COLUMN_ACTIVE
					? this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_ACTIVE + ' DESC'
					: this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_ACTIVE + ' ASC';
				break;
			case Constants.ADMIN_USERS_LIST_SORT_COLUMN_SIGNUP_DATE:
				this.sort == Constants.ADMIN_USERS_LIST_SORT_COLUMN_SIGNUP_DATE
					? this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_SIGNUP_DATE + ' DESC'
					: this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_SIGNUP_DATE + ' ASC';
				break;
		}
		this.getUsers(null, null);
		this.changeDetectorRef.detectChanges();
	}
}