import { Component, OnInit } from '@angular/core';
import { Speaker } from '../../../../models/campus/Speaker';
import { CampusAdminService } from '../../../../services/admin/campus-admin.service';
import { Constants } from '../../../../app.constants';

@Component({
    selector: 'app-campus-admin-speakers',
    templateUrl: './campus-admin-speakers.component.html',
    styleUrls: ['./campus-admin-speakers.component.css']
})
export class CampusAdminSpeakersComponent implements OnInit {

    errorTitle: string;
    errorMessage: string;
    openDataErrorTitle: string;
    openDataErrorMessage: string;
    messages: any[];

    speakers: Speaker[] = [];
    speakersCopy: Speaker[] = [];
    selectedSpeaker: Speaker;
    display: boolean = false;
    isNewSpeaker: boolean = false;
    emptyMessage: string;
    constructor(private campusAdminService: CampusAdminService) {
        this.selectedSpeaker = new Speaker();
        this.emptyMessage = 'No se han encontrado resultados';
    }

    ngOnInit() {
        this.openDataErrorTitle = Constants.OPEN_DATA_STATIC_CONTENT_ERROR_TITLE;
        this.openDataErrorMessage = Constants.OPEN_DATA_STATIC_CONTENT_ERROR_MESSAGE;
        this.getSpeakers();
    }

    getSpeakers() {
        this.campusAdminService.getSpeakers().subscribe(result => {
            try {
                this.speakers = result;
            } catch{
                console.error('Error: getSpeakers() - campus-admin-speakers.component.ts');
                this.errorTitle = this.openDataErrorTitle;
                this.errorMessage = this.openDataErrorMessage;
            }
        });
    }

    showDialog(speaker) {
        this.display = !this.display;
        this.selectedSpeaker = speaker;
    }

    save(speaker) {
        if (this.validation(speaker)) {
            if (this.isNewSpeaker) {
                this.callInsertSpeakerService(speaker);
            } else {
                this.callUpdateSpeakerService(speaker);
            }
            this.isNewSpeaker = false;
            this.display = !this.display;
        } else {
            this.showMessage('warn',
                '¡ATENCIÓN!',
                'No se han introducido todos los campos obligatorios'
            );
        }
    }

    cancel() {
        this.display = !this.display;
        this.isNewSpeaker = false;
        this.selectedSpeaker = new Speaker();
    }

    addSpeaker() {
        this.isNewSpeaker = true;
        this.showDialog(new Speaker());
    }

    validation(speaker: Speaker) {
        let validated = false;
        if (speaker.name != null && speaker.name != undefined && speaker.name.length > 0) {
            validated = true;
        }
        return validated;
    }

    callInsertSpeakerService(speaker) {
        this.campusAdminService.insertNewSpeaker(speaker).subscribe(result => {
            if (result.status == 200 && result.success) {
                speaker.id = result.id;
                this.speakers.push(speaker);
                this.refreshTable();
                this.showMessage('success',
                    'Inserción de ponente',
                    'Ponente añadido correctamente'
                );
            } else {
                this.showMessage('error',
                    'Inserción de ponente',
                    'Error al añadir el ponente'
                );
            }
        });
    }

    callUpdateSpeakerService(speaker) {
        this.campusAdminService.updateSpeaker(speaker).subscribe(result => {
            if (result.status == 200 && result.success) {
                this.showMessage('success',
                    'Actualización de ponente',
                    'Ponente actualizado correctamente'
                );
            } else {
                this.showMessage('error',
                    'Actualización de ponente',
                    'Error al actualizar el ponente'
                );
            }
        });
    }

    showMessage(severity, summary, detail) {
        this.messages = [];
        this.messages.push({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }

    refreshTable() {
        this.speakersCopy = Object.assign([], this.speakers);
        this.speakers = this.speakersCopy;
    }
}