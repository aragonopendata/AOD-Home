import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { OrganizationAdmin } from '../../../../../models/OrganizationAdmin'
import { SelectItem, MessagesModule, GrowlModule, Message, ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';
import { User } from '../../../../../models/User'
import { OrganizationsAdminService } from '../../../../../services/admin/organizations-admin.service';
import { UsersAdminService } from '../../../../../services/admin/users-admin.service';
import { Constants } from 'app/app.constants';

@Component({
	selector: 'app-organizations-admin',
	templateUrl: './organizations-admin-list.component.html',
	styleUrls: ['./organizations-admin-list.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class OrganizationsAdminListComponent implements OnInit {

	organizationAdminMessages: Message[] = [];

	orgs: OrganizationAdmin[] = [];
	user: any;
	showSaveButton: boolean = false;
	showEditButtons: boolean = false;
	showDeleteButton: boolean = false;

	constructor(private organizationsAdminService: OrganizationsAdminService
			, private usersAdminService: UsersAdminService
			, private confirmationService: ConfirmationService) {	}

	ngOnInit() {
		this.getPermissions();
		this.getOrgsByUser();
	 }

	getPermissions(): void{
		this.user = this.usersAdminService.getCurrentUser();
		if(this.user.rol == Constants.ADMIN_USER_ROL_GLOBAL_ADMIN){
			this.showSaveButton = true;
			this.showEditButtons = true;
			this.showDeleteButton = true;
		}
		if(this.user.rol == Constants.ADMIN_USER_ROL_ORGANIZATION_ADMIN){
			this.showEditButtons = true;
		}
	}

	getOrgsByUser(): void{
		this.usersAdminService.getOrganizationsByCurrentUser().subscribe(orgs => {
			try {
				this.orgs = JSON.parse(orgs).result;
			} catch (error) {
				console.error(Constants.ERROR_ORGANIZATION_GET_ORGS_BY_USER);
			}
		});
	}

	removeOrg(org: OrganizationAdmin){	
		this.organizationsAdminService.removeOrganization(org.name, this.user.id, this.user.username).subscribe( result => {
			if (result.success) {
				this.organizationAdminMessages = [];
				this.organizationAdminMessages.push({severity: Constants.GROWL_SEVERITY_SUCCESS, summary: Constants.GROWL_DELETE_ORGANIZATION_SUMMARY
						, detail: Constants.GROWL_DELETE_ORGANIZATION_SUCCESS_DETAIL});
				setTimeout(()=>{ 
				this.getOrgsByUser();
				},2000);
			}
		});     
	}

	confirm(organization: OrganizationAdmin): void{
		this.confirmationService.confirm({
			message: Constants.CONFIRMDIALOG_MESSAGE_START + organization.title + Constants.CONFIRMDIALOG_MESSAGE_END,
			header: Constants.CONFIRMDIALOG_HEADER,
			accept: () => {
				this.removeOrg(organization);
			}
		})
	}
}
