import { Component, OnInit } from '@angular/core';
import { Content } from '../../../../models/campus/Content';
import { CampusAdminService } from '../../../../services/admin/campus-admin.service';
import { Speaker } from '../../../../models/campus/Speaker';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-campus-admin-entries',
    templateUrl: './campus-admin-entries.component.html',
    styleUrls: ['./campus-admin-entries.component.css']
})
export class CampusAdminEntriesComponent implements OnInit {

    display: boolean;
    entries: Content[];
    selectedEntry: Content;
    topics: string[] = [];
    events: Event[] = [];
    speakers: Speaker[] = [];

    constructor(private campusAdminService: CampusAdminService, public sanitizer: DomSanitizer) {
        this.display = false;
        this.entries = [];
        this.selectedEntry = new Content();
    }

    ngOnInit() {
        this.getEntries();
    }

    getEntries() {
        this.campusAdminService.getEntries().subscribe(result => {
            this.entries = result;
        });
    }

    getEntry(id) {
        this.campusAdminService.getEntry(id).subscribe(result => {
            this.selectedEntry = result;
            console.log(this.selectedEntry);
            this.selectedEntry.topics.forEach(topic => {
                this.topics.push(topic.name);
            });
            this.getEvents();
            this.getSpeakers();
        });
    }

    getEvents() {
        this.campusAdminService.getEvents().subscribe(result => {
            this.events = result;
        });
    }

    getSpeakers() {
        this.campusAdminService.getSpeakers().subscribe(result => {
            this.speakers = result;
        });
    }

    showDialog(entry) {
        this.display = !this.display;
        this.getEntry(entry.id);
    }

    cancel() {
        this.display = !this.display;
        this.selectedEntry = new Content();
        this.topics = [];
    }

}