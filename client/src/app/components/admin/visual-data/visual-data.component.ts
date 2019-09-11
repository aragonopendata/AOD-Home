import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../app.constants';
import { DomSanitizer } from '@angular/platform-browser';
import { UsersAdminService } from 'app/services/admin/users-admin.service';
import { AuthenticationService } from 'app/services/security/authentication.service';
import { LoginService } from 'app/services/security/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-visual-data',
    templateUrl: './visual-data.component.html',
    styleUrls: ['./visual-data.component.css']
})
export class VisualDataComponent implements OnInit {

    srcIframe;
    user: any;

    constructor(private domSanitizer : DomSanitizer, private usersAdminService: UsersAdminService, private authenticationService: AuthenticationService, private loginService: LoginService, private router: Router) {
        this.srcIframe = this.domSanitizer.bypassSecurityTrustResourceUrl(window["config"]["AOD_BASE_URL"] + '/servicios/visualdata/adminPanel');
    }

    ngOnInit() {
        this.getPermissions();
    }

    getPermissions(): void{
		this.user = this.authenticationService.getCurrentUser();
		if(this.user.rol != Constants.ADMIN_USER_ROL_GLOBAL_ADMIN){
			this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN]);
		}
	}
}
