import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/security/authentication.service';
import { LoginService } from '../../services/security/login.service';
import { Constants } from '../../app.constants';
import { UsersAdminService } from 'app/services/admin/users-admin.service';
import { OrganizationAdmin } from 'app/models/OrganizationAdmin';
import { OrganizationsAdminService } from 'app/services/admin/organizations-admin.service';
import { Dataset } from 'app/models/Dataset';
import { DatasetsAdminService } from 'app/services/admin/datasets-admin.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    organization: OrganizationAdmin = new OrganizationAdmin();
    dataset: Dataset = new Dataset();

	model: any = {};
    loading = false;
    error = '';
    userIsMember: boolean = false;
    isOrg: boolean = false;
    isDataset: boolean = false;

    user: any;

    dataParam: string;
    dataNameParam: string;
    

    constructor(private router: Router, private authenticationService: AuthenticationService, private loginService: LoginService
                , private activatedRoute: ActivatedRoute, private usersAdminService: UsersAdminService
                , private organizationsAdminService: OrganizationsAdminService, private datasetAdminService: DatasetsAdminService){ }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.dataParam = params[Constants.ROUTER_LINK_DATA_PARAM_DATA_LOGIN];
            if(this.dataParam === Constants.LOGIN_DATA_PARAM_TYPE_ORGANIZATION){
                this.dataNameParam = params[Constants.ROUTER_LINK_DATA_PARAM_EDIT_DATA];
                this.isOrg = true;
            }
            if(this.dataParam === Constants.LOGIN_DATA_PARAM_TYPE_DATASET){
                this.dataNameParam = params[Constants.ROUTER_LINK_DATA_PARAM_EDIT_DATA];
                this.isDataset = true;
            }
          });
        
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
                this.user = this.authenticationService.getCurrentUser();
                if(this.isOrg){
                    this.editOrganization();
                }else if(this.isDataset){
                    this.editDataset();
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

    editDataset(){
        this.datasetAdminService.getDatasetByName(this.dataNameParam).subscribe( dataResult => {
            try {
        		this.dataset = JSON.parse(dataResult).result;
                this.organizationsAdminService.getOrganizationByName(this.dataset.owner_org).subscribe(org => {
                    try{
                        this.organization = JSON.parse(org).result;
                        if(this.user.rol != Constants.ADMIN_USER_ROL_ORGANIZATION_MEMBER){
                            if(this.isMember()){
                                this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN_DATACENTER_DATASETS_EDIT + '/' + this.dataset.name]);
                            }else{
                                this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN]);
                            }
                            //Have no permissions, redirecto to main admin page
                        }else{
                            this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN]);
                        }

                    }catch(error){
                        console.error("Error editDataset() - login.component.ts");
                    }
                }); 
            }catch(error){
        		console.error("Error: editDataset() - login.component.ts");
            }
        });
    }

    editOrganization(): void{
        this.organizationsAdminService.getOrganizationByName(this.dataNameParam).subscribe(org => {
            try{
                this.organization = JSON.parse(org).result;
                if(this.user.rol != Constants.ADMIN_USER_ROL_ORGANIZATION_MEMBER){
                    if(this.isMember()){
                        this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN_DATACENTER_ORGANIZATIONS_EDIT + '/' + this.organization.name]);
                    }else{
                        this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN]);
                    }
                    //Have no permissions, redirecto to main admin page
                }else{
                    this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN]);
                }

            }catch(error){
                console.error("Error editDataset() - login.component.ts");
            }
        });
    }

    //Check if the user belongs to the organization
    isMember(): boolean{
        try {
            for(let user of this.organization.users){
                if(this.user.username == user.name){
                    this.userIsMember = true;
                }
            }
            return this.userIsMember;
        } catch (error) {
            console.log(error);
        }
        
    }
}