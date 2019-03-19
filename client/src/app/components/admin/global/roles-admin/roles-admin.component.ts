import { Component, OnInit } from '@angular/core';
import { Role } from '../../../../models/Role';
import { User } from '../../../../models/User';
import { RolesAdminService } from 'app/services/admin/roles-admin.service';
import { Constants } from 'app/app.constants';
import { Message } from 'primeng/primeng';

@Component({
	selector: 'app-roles-admin',
	templateUrl: './roles-admin.component.html',
	styleUrls: ['./roles-admin.component.css']
})
export class RolesAdminComponent implements OnInit {

	roleAdminMessages: Message[] = [];
	displayDialog: boolean;
	displayUsers: boolean;
	displayDialogEdit: boolean;
	displayDeleteDialog: boolean;
	editDialogTitle: string;

	users: User[];
	roles: Role[];

	user: User = new User();
	role: Role = new Role();

	//Pagination and ordering params
	sort: string;
	pageRows: number;

	constructor(private rolesAdminService: RolesAdminService) {
		this.pageRows = Constants.ADMIN_USERS_LIST_ROWS_PER_PAGE;
		this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_NAME;
	}

	ngOnInit() {
		this.getRoles();
	}

	showUsers(role) {
		this.role = role;
		this.users = [];
		this.rolesAdminService.getUsersOfRole(this.role.id).subscribe(users => {
			try {
				if(users[0] != undefined){
					for (var index = 0; index < users.length; index++) {
						this.user = new User();
						this.user = users[index];
						this.users = [...this.users, this.user];
					}
					this.displayUsers = true;
				}else{
					this.roleAdminMessages = [];
					this.roleAdminMessages.push({ severity: 'warn', summary: 'Usuarios asignados', detail: 'Ningun usuario tiene ese rol asignado' });
				}
			} catch (error) {
				console.error('Error: getUsersOfRole() - roles-admin.component.ts');
			}
		});
	}

	showDialog(role, edit, create) {
		this.role = this.cloneRole(role);
		if (edit) {
			this.roleEditDialog(role);
		} else if (create) {
			this.roleCreateDialog();
		} else {
			this.roleShowDialog(role);
		}
	}

	showDeleteDialog(role) {
		this.role = role;
		this.displayDeleteDialog = true;
	}

	roleEditDialog(role){
		this.editDialogTitle = 'Modificar Rol';
		this.role = this.cloneRole(role);
		this.displayDialogEdit = true;
	}

	roleCreateDialog(){
		this.editDialogTitle = 'Crear Rol';
		this.role = new Role();
		this.role.active = false;
		this.displayDialogEdit = true;
	}

	roleShowDialog(role){
		this.role = this.cloneRole(role);
		this.displayDialog = true;
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

	deleteRole() {
		this.rolesAdminService.removeRole(this.role).subscribe(res => {
			if (res.success) {
				if (this.roleAdminMessages.length > 4){
					this.roleAdminMessages = [];
				}
				this.roleAdminMessages.push({ severity: 'success', summary: 'Borrado de rol', detail: 'Rol borrado correctamente' });
				this.displayDeleteDialog = false;
				this.role = new Role();
				this.roles = [];
				this.getRoles();
			} else {
				this.roleAdminMessages = [];
				this.roleAdminMessages.push({ severity: 'error', summary: 'Borrado de rol', detail: 'Error al borrar el rol' });
			}
		});
	}

	undoDeleteRole() {
		this.displayDeleteDialog = false;
		this.role = new Role;
	}

	getRoles() {
		this.roles = [];
		this.rolesAdminService.getRoles().subscribe(roles => {			
			try {
				for (var index = 0; index < roles.length; index++) {
					this.role = new Role();
					this.role = roles[index];
					this.roles = [...this.roles, this.role];
				}
			} catch (error) {
				console.error('Error: getRoles() - roles-admin.component.ts');
			}
		});
	}

	validateRoleForm() {
		if (this.role.name != undefined && this.role.name != '' 
		&& this.role.description != undefined && this.role.description != '' 
		&& this.role.active != undefined) {
			this.roleAdminMessages = [];
			return true;
		}
	}

	validateRoleFormEdit() {
		if (this.role.name != undefined && this.role.name != '' 
				&& this.role.description != undefined && this.role.description != '' 
				&& this.role.active != undefined) {
			this.roleAdminMessages = [];
			return true;
		}
	}

	saveRole() {
		if (!this.role.id) {
			this.saveRoleCreate();
		} else {
			this.saveRoleUpdate();			
		}
	}

	saveRoleCreate(){
		let newRole: any;
		newRole = this.role;
		if (this.validateRoleForm()) {
			this.rolesAdminService.createRole(newRole).subscribe(result => {
				if (result.status == 200 && result.success ) {
					this.roleAdminMessages = [];
					this.roleAdminMessages.push({ severity: 'success', summary: 'Alta de rol', detail: 'Rol insertado correctamente' });
					this.displayDialogEdit = false;
					this.role = new Role();
					this.roles = [];
					this.getRoles();
				} else {
					this.roleAdminMessages = [];
					this.roleAdminMessages.push({ severity: 'error', summary: 'Alta de rol', detail: 'Error al insertar el rol: ' + result.error + (result.message ? result.message + '.' : '.') });
				}
			});
		} else {
			this.roleAdminMessages = [];
			this.roleAdminMessages.push({ severity: 'warn', summary: 'Alta de rol', detail: ' Faltan campos por rellenar del rol' });
		}
	}

	saveRoleUpdate(){
		if (this.validateRoleFormEdit()) {
			let roleUpdated: any = this.role;
			this.rolesAdminService.updateRole(roleUpdated).subscribe(response => {
				this.roleAdminMessages = [];
				if (response.status == 200) {
					this.roleAdminMessages.push({ severity: 'success', summary: 'Rol Actualizado', detail: 'Se ha actualizado el rol con exito' });
					this.displayDialogEdit = false;
					this.role = new Role();
					this.getRoles();
				}
				if (response.status == 409) {
					this.roleAdminMessages.push({ severity: 'warn', summary: response.errorTitle, detail: response.errorDetail });
				} else if (response.status != 200) {
					this.roleAdminMessages.push({ severity: 'warn', summary: response.errorTitle, detail: response.errorDetail });
				}else if (response.status == 404) {
					this.roleAdminMessages.push({ severity: 'warn', summary: response.errorTitle, detail: response.errorDetail });
				}
			});
		} else {
			this.roleAdminMessages = [];
			this.roleAdminMessages.push({ severity: 'warn', summary: 'Edición de rol', detail: ' Faltan campos por rellenar del rol' });
		}
	}

}
