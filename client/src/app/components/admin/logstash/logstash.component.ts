import { Component, OnInit } from '@angular/core';
import { SelectItem, MessagesModule, GrowlModule, Message } from 'primeng/primeng';
import { LogstashService } from '../../../services/admin/logstash.service';
import { Logstash } from '../../../models/Logstash';
import { Constants } from 'app/app.constants';
import { AuthenticationService } from 'app/services/security/authentication.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-logstash',
	templateUrl: './logstash.component.html',
	styleUrls: ['./logstash.component.css']
})

export class LogstashComponent implements OnInit {

	logstash: Logstash;
	portals: Logstash[];

	userAdminMessages: Message[] = [];
	displayDeleteDialog: boolean = false;
	displayEditDialog: boolean = false;
	displayReloadDialog: boolean = false;
	editing: boolean = false;
	editDialogTitle: string;
	fromDate: any;
	toDate: any;

	user: any;

	constructor(private logstashService: LogstashService, private authenticationService: AuthenticationService, private router: Router) {
		this.portals = [];
	}

	ngOnInit() {
		this.getPermissions();
	}

	getPermissions(): void {
		this.user = this.authenticationService.getCurrentUser();

		if (this.user.rol == Constants.ADMIN_USER_ROL_GLOBAL_ADMIN) {
			this.getFiles();
		} else {
			this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN_GLOBAL_DASHBOARD]);
		}
	}

	getFiles() {
		this.logstashService.getFilesAdmin().subscribe(portals => {
			this.portals = portals.message;
		});
	}

	showDialog(logstash, edit, create) {
		if (edit) {
			this.editDialogTitle = 'Modificar Portal';
			this.logstash = this.cloneUser(logstash);
			this.displayEditDialog = true;
			this.editing = true;
		} else if (create) {
			this.editDialogTitle = 'Crear Portal';
			this.logstash = new Logstash();
			this.displayEditDialog = true;
			this.editing = false;
		}
	}

	showDeleteDialog(logstash) {
		this.logstash = logstash;
		this.displayDeleteDialog = true;
	}

	showReloadDialog(logstash) {
		this.logstash = logstash;
		this.displayReloadDialog = true;
	}

	cloneUser(logstashToClone: Logstash): Logstash {
		let logstashCloned = new Logstash();
		for (let logstashProperty in logstashToClone) {
			logstashCloned[logstashProperty] = logstashToClone[logstashProperty];
		}
		return logstashCloned;
	}

	saveLogstash() {
		if (this.valitadeLogstashForm()) {
			this.logstashService.saveLogstash(this.logstash).subscribe(result => {
				if (result.status == 200) {
					this.userAdminMessages = [];
					this.userAdminMessages.push({ severity: 'success', summary: 'Alta de Logstash', detail: 'Registro creado correctamente' });
					this.displayEditDialog = false;
					this.getFiles();
				} else {
					this.userAdminMessages = [];
					this.userAdminMessages.push({ severity: 'error', summary: 'Alta de Logstash', detail: result.error.detail });
					this.displayEditDialog = false;
				}
				this.logstash = new Logstash();
			});
		} else {
			this.userAdminMessages = [];
			this.userAdminMessages.push({ severity: 'warn', summary: 'Alta de Logstash', detail: 'Faltan campos por rellenar del formulario' });

		}
	}

	updateLogstash() {
		if (this.valitadeLogstashForm()) {
			this.logstashService.updateLogstash(this.logstash).subscribe(result => {
				if (result.status == 200) {
					this.userAdminMessages = [];
					this.userAdminMessages.push({ severity: 'success', summary: 'Modificación de Logstash', detail: 'Registro modificado correctamente' });
					this.displayEditDialog = false;
					this.getFiles();
				} else {
					this.userAdminMessages = [];
					this.userAdminMessages.push({ severity: 'error', summary: 'Alta de Logstash', detail: result.error.detail });
					this.displayEditDialog = false;
				}
				this.logstash = new Logstash();
			});
		} else {
			this.userAdminMessages = [];
			this.userAdminMessages.push({ severity: 'warn', summary: 'Modificación de Logstash', detail: 'Faltan campos por rellenar del formulario' });
		}
	}

	undoDeleteLogstash() {
		this.displayDeleteDialog = false;
		this.logstash = new Logstash;
	}

	deleteLogstash() {
		this.logstashService.deleteLogstash(this.logstash).subscribe(result => {
			if (result.status == 200) {
				this.userAdminMessages = [];
				this.userAdminMessages.push({ severity: 'success', summary: 'Eliminación de Logstash', detail: 'Registro eliminado correctamente' });
				this.displayDeleteDialog = false;
				this.getFiles();
			} else {
				this.userAdminMessages = [];
				this.userAdminMessages.push({ severity: 'error', summary: 'Alta de Logstash', detail: result.error.detail });
				this.displayDeleteDialog = false;
			}
			this.logstash = new Logstash();
		});
	}

	enableLogstash(id) {
		this.logstashService.enableLogstash(id).subscribe(result => {
			if (result.status == 200) {
				this.userAdminMessages = [];
				this.userAdminMessages.push({ severity: 'success', summary: 'Activación de Logstash', detail: 'Portal activado' });
				this.displayDeleteDialog = false;
				this.getFiles();
			} else {
				this.userAdminMessages = [];
				this.userAdminMessages.push({ severity: 'error', summary: 'Activación de Logstash', detail: result.error.detail });
				this.displayDeleteDialog = false;
			}
			this.logstash = new Logstash();
		});
	}

	disableLogstash(id) {
		this.logstashService.disableLogstash(id).subscribe(result => {
			if (result.status == 200) {
				this.userAdminMessages = [];
				this.userAdminMessages.push({ severity: 'success', summary: 'Desactivación de Logstash', detail: 'Portal desactivado' });
				this.displayDeleteDialog = false;
				this.getFiles();
			} else {
				this.userAdminMessages = [];
				this.userAdminMessages.push({ severity: 'error', summary: 'Desactivación de Logstash', detail: result.error.detail });
				this.displayDeleteDialog = false;
			}
			this.logstash = new Logstash();
		});
	}

	reloadLogstash() {
		this.logstashService.reloadLogstash(this.logstash.id_logstash,new Date(this.fromDate).getTime(),new Date(this.toDate).getTime()).subscribe(result => {
			if (result.status == 200) {
				this.userAdminMessages = [];
				this.userAdminMessages.push({ severity: 'success', summary: 'Recarga de portales', detail: 'Recarga iniciada' });
				this.displayReloadDialog = false;
			} else {
				this.userAdminMessages = [];
				this.userAdminMessages.push({ severity: 'error', summary: 'Recarga de portales', detail: result.error.detail });
				this.displayReloadDialog = false;
			}
			this.logstash = new Logstash();
			this.fromDate = undefined;
			this.toDate = undefined;
		});
	}

	valitadeLogstashForm() {
		if (this.logstash.delay != undefined && this.logstash.delay != ''
			&& this.logstash.portal_name != undefined && this.logstash.portal_name != ''
			&& this.logstash.type != undefined && this.logstash.type != ''
			&& this.logstash.url != undefined && this.logstash.url != ''
			&& this.logstash.view != undefined && this.logstash.view != '') {
			this.userAdminMessages = [];
			return true;
		}
	}
}
