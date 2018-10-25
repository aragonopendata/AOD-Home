import { Component, OnInit } from '@angular/core';
import { UsersAdminService } from 'app/services/admin/users-admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/services/security/authentication.service';
import { Constants } from 'app/app.constants';
import { LoginService } from 'app/services/security/login.service';

@Component({
	selector: 'app-home-admin',
	templateUrl: './home-admin.component.html',
	styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {

	currentUserName: string;
	routerLinkLogin: string;

	user: any;
	showUsersMenu: boolean = false;
	showAnalyticsMenu: boolean = false;
	showVisualData: boolean = false;
	showSysAdminMenu: boolean = false;

	constructor(private usersAdminService: UsersAdminService, private authenticationService: AuthenticationService, private loginService: LoginService, private router: Router) {
		this.routerLinkLogin = Constants.ROUTER_LINK_LOGIN;
		
	 }

	ngOnInit() {
		this.getPermissions();
		this.currentUserName = this.user.fullname;
		this.usersAdminService.refreshUser();
	}

	getPermissions(): void{
		this.user = this.authenticationService.getCurrentUser();
		if(this.user.rol == Constants.ADMIN_USER_ROL_GLOBAL_ADMIN){
			this.showUsersMenu = true;
			this.showAnalyticsMenu = true;
			this.showVisualData = true;
		} else if (this.user.rol == Constants.ADMIN_USER_ROL_SYS_ADMIN) {
			this.showSysAdminMenu = true;
		}
	}

	logout(){
		this.usersAdminService.currentUser = undefined;
		this.loginService.announceLogout();
		this.authenticationService.logout();
		window.location.reload();
	}

}
