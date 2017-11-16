import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Constants } from '../../../../../app.constants';
import { OrganizationAdmin } from '../../../../../models/OrganizationAdmin'
import { OrganizationsAdminService } from '../../../../../services/admin/organizations-admin.service';
import { UsersAdminService } from '../../../../../services/admin/users-admin.service';
import { User } from 'app/models/User';
import { Extra } from 'app/models/Extra';

@Component({
  selector: 'app-organizations-admin-show',
  templateUrl: './organizations-admin-show.component.html',
  styleUrls: ['./organizations-admin-show.component.css']
})
export class OrganizationsAdminShowComponent implements OnInit {
  
  user: any;
  userAdminOrg: User;

  showEditButton: boolean = true;

  webpage: Extra = new Extra();
  address: Extra = new Extra();
  person: Extra = new Extra();

  org: OrganizationAdmin = new OrganizationAdmin();
  sort: string;
  email: string;
  
  routerLinkOrgList: string;

  constructor(private organizationsAdminService: OrganizationsAdminService
          , private activatedRoute: ActivatedRoute
          , private usersAdminService: UsersAdminService
          , private router: Router) {
            
            this.routerLinkOrgList = Constants.ROUTER_LINK_ADMIN_DATACENTER_ORGANIZATIONS_LIST;
            this.webpage.key = Constants.ORGANIZATION_EXTRA_WEBPAGE;
            this.address.key = Constants.ORGANIZATION_EXTRA_ADDRESS;
            this.person.key = Constants.ORGANIZATION_EXTRA_PERSON;
           }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.org.name = params[Constants.ROUTER_LINK_DATA_PARAM_ORGANIZATION_NAME];
    });
    if(this.org.name != null){
      this.loadOrganization();
    }
    this.getPermissionsCurrentUser();
  }

  getExtras(): void {
		//webpage, address and person from extras
		if (this.org.extras !== undefined) {
			for (let extra of this.org.extras) {
				if (extra.key === Constants.ORGANIZATION_EXTRA_WEBPAGE) {
          this.webpage.value = extra.value;
				} else if (extra.key === Constants.ORGANIZATION_EXTRA_ADDRESS) {
					this.address.value = extra.value;
				} else if (extra.key === Constants.ORGANIZATION_EXTRA_PERSON) {
					this.person.value = extra.value;
        }
			}
		}
  }

  getEmail(): void {
    this.usersAdminService.getUser(this.org.users[0].name, this.user.id).subscribe( user => {
      try{
        this.userAdminOrg = JSON.parse(user).result;
        this.email = this.userAdminOrg.email;
      }catch(error){
        console.error(Constants.ERROR_ORGANIZATION_GET_EMAIL);
      }
    });
  }

  getPermissionsCurrentUser(): void{
    this.user = this.usersAdminService.getCurrentUser();
    if(this.user.rol == Constants.ADMIN_USER_ROL_ORGANIZATION_EDITOR){
      this.showEditButton = false;
    }
  }

  loadOrganization(){
    this.organizationsAdminService.getOrganizationByName(this.org.name).subscribe(org => {
      try{
        this.sort = Constants.SERVER_API_LINK_PARAM_SORT_DEFAULT_VALUE;
        this.org = JSON.parse(org).result;
        this.getExtras();
        this.getEmail();
      }catch(error){
        console.error(Constants.ERROR_ORGANIZATION_GET_ORG);
      }
    });
  }

  cancel(): void{
    this.router.navigate(['/' + this.routerLinkOrgList]);
  }
}
