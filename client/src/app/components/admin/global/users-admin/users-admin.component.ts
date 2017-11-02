import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
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
	displayViewDialog: boolean;
	displayEditDialog: boolean;

	users: User[];
	user: User;
	activatedUser: boolean = true;

	role: Role;
	roles: Role[];
	selectedRole: Role;
	selectRoles: SelectItem[] = [];

	//Pagination and ordering params
	sort: string;
	pages: number[];
	actualPage: number;
	pagesShow: string[];
	pageFirst: number;
	pageLast: number;
	pageRows: number;

	constructor(private usersAdminService: UsersAdminService, private rolesAdminService: RolesAdminService, private changeDetectorRef: ChangeDetectorRef) {
		this.pageRows = Constants.ADMIN_USERS_LIST_ROWS_PER_PAGE;
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
		this.selectRoles = [];
		this.selectRoles.push({ label: 'Seleccione un rol', value: null });
		this.rolesAdminService.getRoles().subscribe(roles => {
			try {
				for (var index = 0; index < roles.length; index++) {
					this.role = new Role();
					this.role = roles[index];
					this.roles = [...this.roles, this.role];
					this.selectRoles.push({ label: this.role.description, value: this.role.id });
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

	showDialog(user, edit, create) {
		if (edit) {
			this.user = this.cloneUser(user);
			this.displayEditDialog = true;
		} else if (create) {
			this.user = new User();
			this.user.role = [new Role()];
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

	saveUser() {
		if (!this.user.id) {
			this.user.active = this.activatedUser;
			this.user.role[0] = this.selectedRole;
			this.usersAdminService.createUser(this.user).subscribe(result => {
				console.log('response: ' + JSON.stringify(result));
				if (result.id) {
					this.user.id = result.id;
					this.users = [...this.users, this.user];
					this.user = new User();
				}
			});
			this.displayEditDialog = false;
		} else {
			
		}
	}

	setPagination(actual: number, total: number) {
		this.actualPage = actual;
		this.pageFirst = 0;
		this.pageLast = Math.ceil(+total / +this.pageRows);
		this.pages = [];
		this.pagesShow = [];
		if (this.pageLast == 0) {
			this.pagesShow.push('-');
		}
		for (var index = 0; index < this.pageLast; index++) {
			this.pages.push(+index + 1);
		}
		if (this.actualPage < 4) {
			for (var index = 0; index < 5; index++) {
				if (this.pages[index]) {
					this.pagesShow.push(String(+this.pages[index]));
				}
			}
		} else if (this.actualPage >= (135)) {
			for (var index = (+this.pageLast - 5); index < this.pageLast; index++) {
				if (this.pages[index]) {
					this.pagesShow.push(String(+this.pages[index]));
				}
			}
		} else {
			for (var index = (+actual - 2); index <= (+this.actualPage + 2); index++) {
				if (this.pages[index]) {
					this.pagesShow.push(String(+this.pages[index]));
				}
			}
		}
	}

	paginate(page: number) {
		--page;
		this.getUsers(page, this.pageRows);
		document.body.scrollTop = 0;
	}

	setOrder(event) {
        event.page = 0;
        switch (event.field) {
            case Constants.ADMIN_USERS_LIST_SORT_COLUMN_NAME:
                this.sort == Constants.ADMIN_USERS_LIST_SORT_COLUMN_NAME
                    ? this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_NAME + ' DESC'
					: this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_NAME + ' ASC';
				console.log('Ordenando por: ' + this.sort);
                break;
            case Constants.ADMIN_USERS_LIST_SORT_COLUMN_EMAIL:
				this.sort == Constants.ADMIN_USERS_LIST_SORT_COLUMN_EMAIL
					? this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_EMAIL + ' DESC'
					: this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_EMAIL + ' ASC';
				console.log('Ordenando por: ' + this.sort);
				break;
            case Constants.ADMIN_USERS_LIST_SORT_COLUMN_ROLE:
				this.sort == Constants.ADMIN_USERS_LIST_SORT_COLUMN_ROLE
					? this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_ROLE + ' DESC'
					: this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_ROLE + ' ASC';
				console.log('Ordenando por: ' + this.sort);
				break;
			case Constants.ADMIN_USERS_LIST_SORT_COLUMN_ACTIVE:
				this.sort == Constants.ADMIN_USERS_LIST_SORT_COLUMN_ACTIVE
					? this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_ACTIVE + ' DESC'
					: this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_ACTIVE + ' ASC';
				console.log('Ordenando por: ' + this.sort);
				break;
			case Constants.ADMIN_USERS_LIST_SORT_COLUMN_SIGNUP_DATE:
				this.sort == Constants.ADMIN_USERS_LIST_SORT_COLUMN_SIGNUP_DATE
					? this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_SIGNUP_DATE + ' DESC'
					: this.sort = Constants.ADMIN_USERS_LIST_SORT_COLUMN_SIGNUP_DATE + ' ASC';
				console.log('Ordenando por: ' + this.sort);
				break;
        }
        this.getUsers(null, null);
        this.changeDetectorRef.detectChanges();
    }
}