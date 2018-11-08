import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SysAdminService } from 'app/services/admin/sys-admin.service';
import { AuthenticationService } from 'app/services/security/authentication.service';
import { Constants } from 'app/app.constants';
import { SelectItem, Message } from 'primeng/primeng';

@Component({
    selector: 'app-sys-admin',
    templateUrl: './sys-admin.component.html',
    styleUrls: ['./sys-admin.component.css']
})
export class SysAdminComponent implements OnInit {

    user: any;
    records: any;
    states: SelectItem[];
    selectedState: SelectItem;
    emailRevision: any;
    toCheck: boolean = false;
    msgs: Message[] = [];

    constructor(private sysAdminService: SysAdminService, private authenticationService: AuthenticationService, private router: Router) { }

    ngOnInit() {
        this.checkRol();
        this.states = [
            {label: 'Todos los estados', value: null},
            {label: 'OK', value: 'OK'},
            {label: 'ERROR', value: 'ERROR'}
        ];
        this.checkEmailRevision();
        this.getLogFileData();
    }

    checkRol(){
        this.user = this.authenticationService.getCurrentUser();
        if(this.user.rol != Constants.ADMIN_USER_ROL_SYS_ADMIN){
            this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN_GLOBAL_DASHBOARD]);
        }
    }

    getLogFileData() {
        this.sysAdminService.getLogFileData().subscribe(data => {
            try {
                this.records = data;
            } catch (error) {
                console.error('Error: getFileData() - sys-admin.component.ts');
            }
        });
    }

    checkEmailRevision() {
        this.sysAdminService.getEmailRevision().subscribe(data => {
            try {
                this.emailRevision = data;
                if (this.emailRevision["emailRevision"] == 1) {
                    this.toCheck = true;
                } else {
                    this.toCheck = false;
                }
            } catch (error) {
                console.error('Error: checkFlag() - sys-admin.component.ts');
            }
        });
    }

    changeEmailRevision() {
        if (this.toCheck) {
            this.sysAdminService.changeEmailRevision(this.toCheck).subscribe(response => {
                try {
                    if (response.status == 200) {
                        this.showSuccess();
                        this.checkEmailRevision();
                    } else {
                        this.showError();
                    }
                } catch (error) {
                    console.error('Error: changeFlag() - sys-admin.component.ts');
                    this.showError();
                }
            });
        } else {
            this.showInfo()
        }
    }

    showSuccess() {
        this.msgs = [];
        this.msgs.push({
            severity:'success',
            summary: 'INFORME REVISADO',
            detail: 'El informe ha sido revisado correctamente'
        });
    }

    showInfo() {
        this.msgs = [];
        this.msgs.push({
            severity:'info',
            summary: 'INFORMACIÓN',
            detail: 'El informe ya ha sido revisado previamente'
        });
    }

    showError() {
        this.msgs = [];
        this.msgs.push({
            severity:'error',
            summary: 'ERROR',
            detail: 'Ha ocurrido un error al revisar el informe'
        });
    }

}
