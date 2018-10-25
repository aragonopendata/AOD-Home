import { Component, OnInit } from '@angular/core';
import { SysAdminService } from 'app/services/admin/sys-admin.service';
import { SelectItem, Message } from 'primeng/primeng';

@Component({
    selector: 'app-sys-admin',
    templateUrl: './sys-admin.component.html',
    styleUrls: ['./sys-admin.component.css']
})
export class SysAdminComponent implements OnInit {

    records: any;
    states: SelectItem[];
    selectedState: SelectItem;
    emailRevision: any;
    toCheck: boolean = false;
    msgs: Message[] = [];

    constructor(private sysAdminService: SysAdminService) { }

    ngOnInit() {
        this.states = [
            {label: 'Todos los estados', value: null},
            {label: 'OK', value: 'OK'},
            {label: 'ERROR', value: 'ERROR'}
        ];
        this.checkEmailRevision();
        this.getLogFileData();
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
            summary: 'INFROME REVISADO',
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
