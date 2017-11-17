import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/security/authentication.service';
import { LoginService } from '../../services/security/login.service';
import { Constants } from '../../app.constants';
import { UsersAdminService } from 'app/services/admin/users-admin.service';
import { OrganizationAdmin } from 'app/models/OrganizationAdmin';
import { OrganizationsAdminService } from 'app/services/admin/organizations-admin.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    organization: OrganizationAdmin = new OrganizationAdmin();

	model: any = {};
    loading = false;
    error = '';
    userIsMember: boolean = false;

    user: any;

    sort: string;

    constructor(private router: Router, private authenticationService: AuthenticationService, private loginService: LoginService
                , private activatedRoute: ActivatedRoute, private usersAdminService: UsersAdminService
                , private organizationsAdminService: OrganizationsAdminService){ }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.organization.name = params[Constants.ROUTER_LINK_DATA_PARAM_ORGANIZATION_NAME];
            console.log(this.organization.name);
          });
        // if(this.authenticationService.token != null){
        //     this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN]);
        // }
        // reset login status
         this.loginService.announceLogout();
         this.authenticationService.logout();
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password).subscribe(result => {
            if (result === true) {
                // login successful
                this.announce();
                if(this.organization.name != undefined){
                    //this.editOrganization();
                    this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN]);
                }else{
                    this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN]);
                }
            } else {
                // login failed
                this.error = 'Usuario o password incorrecto';
                this.loading = false;
            }
        });
    }

    announce() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return this.loginService.announceLogin(currentUser);
        }
    }

    editOrganization(): void{
        //Obtenemos el usuario actual
        this.user = this.usersAdminService.getCurrentUser();
        //Obtenemos la organización (para ver el campo usuarios)
        this.organizationsAdminService.getOrganizationByName(this.organization.name).subscribe(org => {
            try{
              this.sort = Constants.SERVER_API_LINK_PARAM_SORT_DEFAULT_VALUE;
              this.organization = JSON.parse(org).result;
            }catch(error){
              console.error("Error obteniendo organización - login.component.ts");
            }
          });
          console.log(this.organization);
        //Comprueba si el rol del usuario le permite editar
		if(this.user.rol == Constants.ADMIN_USER_ROL_GLOBAL_ADMIN || this.user.rol == Constants.ADMIN_USER_ROL_ORGANIZATION_ADMIN){
			//Comprueba que el usuario pertenece a esa organización.
			for(let user of this.organization.users){
				if(this.user.username == user.name){
					this.userIsMember = true;
				}
            }
            //Si es miembro entra a editar la organización directamente
            if(this.userIsMember){
                this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN_DATACENTER_ORGANIZATIONS_EDIT + '/' + this.organization.name]);
            //Si no es miembro, entra al apartado admin inicial
            }else{
                this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN]);
            }
		}else{
            this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN]);
        }
	}
}