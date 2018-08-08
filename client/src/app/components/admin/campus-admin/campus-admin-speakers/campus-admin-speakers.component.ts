import { Component, OnInit } from '@angular/core';
import { Speaker } from '../../../../models/campus/Speaker';
import { CampusAdminService } from '../../../../services/admin/campus-admin.service';

@Component({
    selector: 'app-campus-admin-speakers',
    templateUrl: './campus-admin-speakers.component.html',
    styleUrls: ['./campus-admin-speakers.component.css']
})
export class CampusAdminSpeakersComponent implements OnInit {
    speakers: Speaker[] = [];
    selectedSpeaker: Speaker;
    display: boolean = false;
    isNewSpeaker: boolean = false;
    emptyMessage: string;
    constructor(private campusAdminService: CampusAdminService) {
        this.selectedSpeaker = new Speaker();
        this.emptyMessage = 'No se han encontrado resultados';
    }

    ngOnInit() {
        this.getSpeakers();
    }

    getSpeakers() {
        this.campusAdminService.getSpeakers().subscribe(result => {
            this.speakers = result;
        });
    }

    showDialog(speaker) {
        this.display = !this.display;
        this.selectedSpeaker = speaker;
    }
    
    save(speaker) {
        if (this.isNewSpeaker) {
            this.campusAdminService.insertNewSpeaker(speaker).subscribe();
        } else {
            this.campusAdminService.updateSpeaker(speaker).subscribe();
        }
        this.isNewSpeaker = false;
        this.display = !this.display;
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
}