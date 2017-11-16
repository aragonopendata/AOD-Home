import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { SelectItem, MessagesModule, GrowlModule, Message } from 'primeng/primeng';
import { Constants } from '../../../../../app.constants';
import { OrganizationAdmin } from '../../../../../models/OrganizationAdmin'
import { User } from '../../../../../models/User'
import { OrganizationsAdminService } from '../../../../../services/admin/organizations-admin.service';
import { UsersAdminService } from '../../../../../services/admin/users-admin.service';
import { Extra } from 'app/models/Extra';

@Component({
  selector: 'app-organizations-admin-edit',
  templateUrl: './organizations-admin-edit.component.html',
  styleUrls: ['./organizations-admin-edit.component.css']
})
export class OrganizationsAdminEditComponent implements OnInit {

  organizationAdminMessages: Message[] = [];

  user: any;
  userAdminOrg: User;

  webpage: Extra = new Extra();
  address: Extra = new Extra();
  person: Extra = new Extra();

  //Boolean to know if we update or save an organization.
  organizationEmpty: boolean;

  org: OrganizationAdmin = new OrganizationAdmin();
  sort: string;
  email: string;
  
  routerLinkOrgList: string;

  constructor(private organizationsAdminService: OrganizationsAdminService, private activatedRoute: ActivatedRoute
          , private usersAdminService: UsersAdminService, private router: Router) {
  
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
      this.organizationEmpty=false;
    }else{
      this.organizationEmpty=true;
    }
    this.getCurrentUser();
  }

  getExtras(): void {
		//webpage, address and person from extras
		if (this.org.extras !== undefined) {
			for (let extra of this.org.extras) {
				if (extra.key === this.webpage.key) {
          this.webpage.value = extra.value;
				} else if (extra.key === this.address.key) {
					this.address.value = extra.value;
				} else if (extra.key === this.person.key) {
					this.person.value = extra.value;
        }
			}
		}
  }

  getEmail(): void {
    if(this.org.users.length > 0){
      this.usersAdminService.getUser(this.org.users[0].name, this.user.id).subscribe( user => {
        try{
          if(user != undefined){
            this.userAdminOrg = JSON.parse(user).result;
            this.email = this.userAdminOrg.email;
          }
        }catch(error){
          console.error("Error: ngOnInit() - organizations-admin-edit.component.ts");
        }
      });
    }
  }

  getCurrentUser(): void{
    this.user = this.usersAdminService.getCurrentUser();
  }

  loadOrganization(): void{
    this.organizationsAdminService.getOrganizationByName(this.org.name).subscribe(org => {
      try{
        this.sort = Constants.SERVER_API_LINK_PARAM_SORT_DEFAULT_VALUE;
        this.org = JSON.parse(org).result;
        this.getExtras();
        this.getEmail();
      }catch(error){
        console.error("Error: ngOnInit() - organizations-admin-edit.component.ts");
      }
    });
  }

  createOrgNameFromTitle(): void{
    var orgName = this.org.title.toLowerCase();
    this.org.name = orgName.split(' ').join('-').split('ñ').join('n')
                  .split('á').join('a').split('é').join('e').split('í').join('i').split('ó').join('o').split('ú').join('u')
                  .split('ä').join('a').split('ë').join('e').split('ï').join('i').split('ö').join('o').split('ü').join('u');
  }

  saveOrganization(): void{
    if(this.org.title == undefined){
      this.organizationAdminMessages = [];
      this.organizationAdminMessages.push({severity:Constants.GROWL_SEVERITY_INFO, summary:Constants.GROWL_CREATE_ORGANIZATION_SUMMARY
          , detail:Constants.GROWL_ORGANIZATION_EMPTY_NAME_DETAIL});
    }else{
      this.createOrgNameFromTitle();
      this.org.requestUserId = this.user.id;
      this.org.requestUserName = this.user.username;
      this.organizationsAdminService.createOrganization(this.org, this.webpage.value, this.address.value, this.person.value).subscribe(result => {
          if (result.success) {
            this.organizationAdminMessages = [];
            this.organizationAdminMessages.push({severity:Constants.GROWL_SEVERITY_SUCCESS, summary:Constants.GROWL_CREATE_ORGANIZATION_SUMMARY
                , detail:Constants.GROWL_CREATE_ORGANIZATION_SUCCESS_DETAIL});
            setTimeout(()=>{ 
              this.router.navigate(['/' + this.routerLinkOrgList]);
            },2000);
        } else {
          this.organizationAdminMessages = [];
          this.organizationAdminMessages.push({severity:Constants.GROWL_SEVERITY_ERROR, summary:Constants.GROWL_CREATE_ORGANIZATION_SUMMARY
              , detail:'Error al insertar la organización ' + result.error + (result.message ? result.message + '.' : '.')});
        }
      });
    }
  }

  updateOrganization(): void{
    if(this.org.title == '' || this.org.title == undefined){
      this.organizationAdminMessages = [];
      this.organizationAdminMessages.push({severity:Constants.GROWL_SEVERITY_INFO, summary:Constants.GROWL_UPDATE_ORGANIZATION_SUMMARY
          , detail:'Nombre de organización vacío'});
    }else{
      this.org.requestUserId = this.user.id;
      this.org.requestUserName = this.user.username;
      for(let index=0; index < this.org.extras.length; index++){
        if(this.org.extras[index].key == Constants.ORGANIZATION_EXTRA_WEBPAGE){
          this.org.extras[index].value = this.webpage.value;
        }
        if(this.org.extras[index].key == Constants.ORGANIZATION_EXTRA_ADDRESS){
          this.org.extras[index].value = this.address.value;
        }
        if(this.org.extras[index].key == Constants.ORGANIZATION_EXTRA_PERSON){
          this.org.extras[index].value = this.person.value;
        }
      }
      this.organizationsAdminService.updateOrganization(this.org).subscribe(result => {
          if (result.success) {
            this.organizationAdminMessages = [];
            this.organizationAdminMessages.push({severity:Constants.GROWL_SEVERITY_SUCCESS, summary:Constants.GROWL_UPDATE_ORGANIZATION_SUMMARY
                , detail:'Organización actualizada correctamente'});
            setTimeout(()=>{ 
              this.router.navigate(['/' + this.routerLinkOrgList]);
            },2000);
        } else {
          this.organizationAdminMessages = [];
          this.organizationAdminMessages.push({severity:Constants.GROWL_SEVERITY_ERROR, summary:Constants.GROWL_UPDATE_ORGANIZATION_SUMMARY
              , detail:'Error al actualizar la organización ' + result.error + (result.message ? result.message + '.' : '.')});
        }
      });
    }
  }

  cancel(): void{
    this.router.navigate(['/' + this.routerLinkOrgList]);
  }
}
