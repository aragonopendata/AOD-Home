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
  logstashs: Logstash[];

  userAdminMessages: Message[] = [];
  displayDeleteDialog: boolean = false;
  displayEditDialog: boolean = false;
  editing: boolean = false;
  editDialogTitle: string;

  user: any;

  constructor(private logstashService: LogstashService, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.getPermissions();
  }

  getPermissions(): void{
		this.user = this.authenticationService.getCurrentUser();
		if(this.user.rol == Constants.ADMIN_USER_ROL_GLOBAL_ADMIN){
      this.getFiles();
		}else{
      this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN_GLOBAL_DASHBOARD]);
    }
	}

  getFiles() {
    this.logstashs = [];
    this.logstashService.getFiles().subscribe(logstashs => {
      try {
        this.logstashs = JSON.parse(logstashs);
      } catch (error) {
        console.error('Error: getFiles() - logstash.component.ts');
      }
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
        if (result.status == 200 && result.success) {
          this.userAdminMessages = [];
          this.userAdminMessages.push({ severity: 'success', summary: 'Alta de Logstash', detail: 'Registro creado correctamente' });
          this.displayEditDialog = false;
          this.getFiles();
        } else {
          this.userAdminMessages = [];
          this.userAdminMessages.push({ severity: 'error', summary: 'Alta de Logstash', detail: result.error.detail });
          this.displayEditDialog = false;
        }
      });
    } else {
      this.userAdminMessages = [];
      this.userAdminMessages.push({ severity: 'warn', summary: 'Alta de Logstash', detail: 'Faltan campos por rellenar del formulario' });

    }
  }

  updateLogstash() {
    if (this.valitadeLogstashForm()) {
      this.logstashService.updateLogstash(this.logstash).subscribe(result => {
        if (result.status == 200 && result.success) {
          this.userAdminMessages = [];
          this.userAdminMessages.push({ severity: 'success', summary: 'Modificación de Logstash', detail: 'Registro modificado correctamente' });
          this.displayEditDialog = false;
          this.getFiles();
        } else {
          this.userAdminMessages = [];
          this.userAdminMessages.push({ severity: 'error', summary: 'Alta de Logstash', detail: result.error.detail });
          this.displayEditDialog = false;
        }
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
      if (result.status == 200 && result.success) {
        this.userAdminMessages = [];
        this.userAdminMessages.push({ severity: 'success', summary: 'Eliminación de Logstash', detail: 'Registro eliminado correctamente' });
        this.displayDeleteDialog = false;
        this.getFiles();
      } else {
        this.userAdminMessages = [];
        this.userAdminMessages.push({ severity: 'error', summary: 'Alta de Logstash', detail: result.error.detail });
        this.displayDeleteDialog = false;
      }
    });
  }

  reloadLogstash() {
    this.logstashService.reloadLogstash().subscribe(result => {
      if (result.status == 200 && result.success) {
        this.userAdminMessages = [];
        this.userAdminMessages.push({ severity: 'success', summary: 'Recarga de Logstash', detail: 'Recarga Iniciada' });
        this.getFiles();
      } else {
        this.userAdminMessages = [];
        this.userAdminMessages.push({ severity: 'error', summary: 'Alta de Logstash', detail: result.error.detail });
      }
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