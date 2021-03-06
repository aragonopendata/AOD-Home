import { Component, OnInit } from '@angular/core';
import { UsersAdminService } from 'app/services/admin/users-admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/services/security/authentication.service';
import { Constants } from 'app/app.constants';
import { LoginService } from 'app/services/security/login.service';
import { InfoPanelsAdminComponent } from './global/static-content-admin/info-panels-admin/info-panels-admin.component';
import { InfoListAdminComponent } from './global/static-content-admin/info-list-admin/info-list-admin.component';

@Component({
	selector: 'app-home-admin',
	templateUrl: './home-admin.component.html',
	styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {

	currentUserName: string;
	routerLinkLogin: string;
	assetsUrl: string;

	user: any;
	showUsersMenu: boolean = false;
	showAnalyticsMenu: boolean = false;
	showVisualData: boolean = false;
	showSysAdminMenu: boolean = false;
	showContentEditionMenu: boolean = false;

	constructor(private usersAdminService: UsersAdminService, private authenticationService: AuthenticationService, private loginService: LoginService, private router: Router) {
		this.routerLinkLogin = Constants.ROUTER_LINK_LOGIN;
		this.assetsUrl = window["config"]["AOD_ASSETS_BASE_URL"];
		
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
			this.showContentEditionMenu = true;
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

	navigate(sectionName: string){
		if (sectionName == 'open-data' || sectionName == 'apis'
		|| sectionName == 'events' || sectionName == 'developers'
		||sectionName == 'sparql' || sectionName == 'conocimiento'){
			InfoPanelsAdminComponent.doUpdate.next(sectionName);
		}else {
			InfoListAdminComponent.doUpdate.next(sectionName);
		}
	}

}
