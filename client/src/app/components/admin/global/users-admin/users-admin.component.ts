import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SelectItem, MessagesModule, GrowlModule, Message } from 'primeng/primeng';
import { User } from '../../../../models/User';
import { Role } from '../../../../models/Role';
import { UsersAdminService } from '../../../../services/admin/users-admin.service';
import { RolesAdminService } from '../../../../services/admin/roles-admin.service';
import { Constants } from '../../../../app.constants';
import { OrganizationAdmin } from 'app/models/OrganizationAdmin';
import { OrganizationsAdminService } from 'app/services/admin/organizations-admin.service';

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

	userOrgs: OrganizationAdmin[];
	newOrg: OrganizationAdmin;
	orgsSelect: SelectItem[];
	selectedOrg: string;
	createOrg: boolean = false;

	organizationTitle: string;
	organizationWeb: string;
	organizationDescription: string;
	organizationAdress: string;
	organizationPerson: string;
	organizationEmail: string;

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

	constructor(private usersAdminService: UsersAdminService, private rolesAdminService: RolesAdminService, private changeDetectorRef: ChangeDetectorRef,
		private organizationsAdminService: OrganizationsAdminService) {
		this.pageRows = Constants.ADMIN_USERS_LIST_ROWS_PER_PAGE;
		this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_NAME;
	}

	ngOnInit() {
		this.getUsers(null, null);
		this.getRoles();
		this.getUserOrgs();
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

	getUserOrgs(){
		this.orgsSelect = [];
		this.orgsSelect.push({ label: 'Seleccione una organización o cree una nueva', value: undefined });
		this.usersAdminService.getOrganizationsByCurrentUser().subscribe(orgs => {
            try {
				this.userOrgs = JSON.parse(orgs).result;
				for (let org of this.userOrgs) {
					this.orgsSelect.push({ label: org.title, value: org.name });
				}
            } catch (error) {
                console.error('Error: loadUserOrgs() - datasets-list.component.ts');
            }
        });
	}

	changeCreateOrg(){
		if ( this.createOrg ) {
			this.createOrg = false;
		} else {
			this.createOrg = true;
		}
		
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
				&& this.user.password != undefined && this.user.password != ''
				&& this.user.description != undefined && this.user.description != ''
				&& this.selectedRole != undefined && this.selectedOrg != undefined ) {
			this.userAdminMessages = [];
			return true;
		}
	}

	valitadeUserFormEdit() {
		if (this.user.fullname != undefined && this.user.fullname != '' 
				&& this.user.name != undefined && this.user.name != '' 
				&& this.user.email != undefined && this.user.email != '' 
				&& this.user.description != undefined && this.user.description != ''
				&& this.selectedRole != undefined ) {
			this.userAdminMessages = [];
			return true;
		}
	}

	checkOrgForm(){
		if( this.organizationTitle != undefined && this.organizationTitle != ''
		){
			return true;
		} else {
			this.userAdminMessages = [];
			this.userAdminMessages.push({ severity: 'warn', summary: 'Alta de Organización', detail: 'Rellene todos los campos para crear la organización.' });
			return false;
		}
		
	}

	createOrgNameFromTitle(title: string) {
		var orgName = title.toLowerCase();
		return orgName.split(' ').join('-').split('ñ').join('n')
		              .split('á').join('a').split('é').join('e').split('í').join('i').split('ó').join('o').split('ú').join('u')
		              .split('ä').join('a').split('ë').join('e').split('ï').join('i').split('ö').join('o').split('ü').join('u');
	  }

	saveOrg(){
		if( this.checkOrgForm() ){

			this.newOrg = new OrganizationAdmin;
			this.newOrg.title = this.organizationTitle;
			this.newOrg.name =this.createOrgNameFromTitle(this.organizationTitle);
			if ( this.organizationDescription!= undefined) {
				this.newOrg.description = this.organizationDescription;	
			}
			try {
				this.organizationsAdminService.createOrganization(this.newOrg, this.organizationWeb, this.organizationAdress, this.organizationPerson).subscribe(result => {
					if (result.status == 200 && result.success == true){
						this.userAdminMessages = [];
						this.userAdminMessages.push({ severity: 'success', summary: 'Alta de organización', detail: 'Organización creada correctamente' });
						this.getUserOrgs();
						this.createOrg = false;
					} else {
						this.userAdminMessages = [];
						this.userAdminMessages.push({ severity: 'error', summary: 'Alta de organización', detail: 'Error al crear la organización' });
					}
					

				});
			} catch (error) {
				
			}
			
			
		}
		
	}

	saveUser() {
		if (!this.user.id) {
			this.user.active = this.activatedUser;
			this.user.role = [new Role()];
			this.user.role[0] = this.roles[this.selectedRole - 1];
			let newUser: any;
			newUser = this.user;
			newUser.organization = this.selectedOrg;
			if (this.valitadeUserForm()) {
				this.usersAdminService.createUser(newUser).subscribe(result => {
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
			if (this.valitadeUserFormEdit()) {
				let userUpdated: any = this.user;
				userUpdated.role = this.selectedRole;
				this.usersAdminService.updateUser(userUpdated).subscribe(response => {
					this.userAdminMessages = [];
					if (response.status == 200) {
						this.userAdminMessages.push({ severity: 'success', summary: 'Usuario Actualizado', detail: 'Se ha actualizado el usuario con exito' });
						this.displayEditDialog = false;
						this.selectedRole = undefined;
						this.user = new User();
						this.getUsers(null, null);
					}
					if (response.status == 409) {
						this.userAdminMessages.push({ severity: 'warn', summary: response.errorTitle, detail: response.errorDetail });
					} else if (response.status != 200) {
						this.userAdminMessages.push({ severity: 'warn', summary: response.errorTitle, detail: response.errorDetail });
					}
				});
			} else {
				this.userAdminMessages = [];
				this.userAdminMessages.push({ severity: 'warn', summary: 'Edición de usuario', detail: ' Faltan campos por rellenar del usuario' });
			}
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