import { Component, OnInit } from '@angular/core';
import { Content } from '../../../../models/campus/Content';
import { CampusAdminService } from '../../../../services/admin/campus-admin.service';
import { Speaker } from '../../../../models/campus/Speaker';
import { Event } from '../../../../models/campus/Event';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'app-campus-admin-entries',
    templateUrl: './campus-admin-entries.component.html',
    styleUrls: ['./campus-admin-entries.component.css']
})
export class CampusAdminEntriesComponent implements OnInit {

    display: boolean;
    isNewEntry: boolean = false;
    entries: Content[];
    selectedEntry: Content;
    topics: any[] = [];
    events: Event[] = [];
    speakers: Speaker[] = [];
    files: File[];
    img: string;
    searchType: SelectItem[] = [];
    searchByEvent: SelectItem[] = [];
    searchBySpeaker: SelectItem[] = [];
    selectedEvent: Event;
    selectedSpeaker: Speaker;
    selectedType: SelectItem;
    searchOptionEvents: boolean = false;
    searchOptionSpeakers: boolean = false;

    filteredTopics: any[];

    constructor(private campusAdminService: CampusAdminService, public sanitizer: DomSanitizer) {
        this.display = false;
        this.entries = [];
        this.selectedEntry = new Content();
    }

    ngOnInit() {
        this.getEntries();
        this.setSearchTypes();
        this.setEventSearch();
        this.setSpeakerSearch();
    }

    setSearchTypes() {
        this.searchType.push({ value: undefined, label: 'Tipo de búsqueda' });
        this.searchType.push({ value: 1, label: 'Buscar por evento' });
        this.searchType.push({ value: 2, label: 'Búsqueda por ponente' });
    }

    setEventSearch() {
        this.searchByEvent.push({ value: undefined, label: 'Selecciona un evento' });
        this.getEvents();
    }

    setSpeakerSearch() {
        this.searchBySpeaker.push({ value: undefined, label: 'Selecciona un ponente' });
        this.getSpeakers();
    }

    getEntries() {
        this.campusAdminService.getEntries().subscribe(result => {
            this.entries = result;
        });
    }

    getEntriesByEvent() {
        if (this.selectedEvent) {
            this.campusAdminService.getEntriesByEvent(this.selectedEvent).subscribe(result => {
                this.entries = result;
            });
        } else {
            this.getEntries();
        }
    }

    getEntriesBySpeaker() {
        if (this.selectedSpeaker) {
            this.campusAdminService.getEntriesBySpeaker(this.selectedSpeaker).subscribe(result => {
                this.entries = result;
            });
        } else {
            this.getEntries();
        }
    }

    getEntry(id) {
        this.campusAdminService.getEntry(id).subscribe(result => {
            this.selectedEntry = result;
            this.selectedEntry.topics.forEach(topic => {
                this.topics.push({ id: topic.id, name: topic.name });
            });
        });
    }

    getEvents() {
        this.campusAdminService.getEvents().subscribe(result => {
            this.events = result;
            this.events.forEach(event => {
                this.searchByEvent.push({ value: event.id, label: event.name });
            });
        });
    }

    getSpeakers() {
        this.campusAdminService.getSpeakers().subscribe(result => {
            this.speakers = result;
            this.speakers.forEach(speaker => {
                this.searchBySpeaker.push({ value: speaker.id, label: speaker.name });
            });
        });
    }

    addEntry() {
        this.isNewEntry = true;
        this.showDialog(new Content());
    }

    showDialog(entry) {
        this.display = !this.display;
        if (!this.isNewEntry) {
            this.getEntry(entry.id);
        }
    }

    save(entry) {
        if (this.isNewEntry) {
            this.campusAdminService.insertNewEntry(entry);
        } else {
            this.campusAdminService.updateEntry(entry);
        }
        this.isNewEntry = false;
        this.display = !this.display;
    }

    cancel() {
        this.display = !this.display;
        this.selectedEntry = new Content();
        this.topics = [];
        this.isNewEntry = false;
    }
    
    fileChange(event) {
        this.files = event.target.files;
        var file: File = this.files[0];
        var myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
            this.img = myReader.result;
            this.selectedEntry.thumbnail = this.img.replace("data:image/png;base64,", "");
        }
        myReader.readAsDataURL(file);
    }

    change(type) {
        this.getEntries();
        this.selectedEvent = undefined;
        this.selectedSpeaker = undefined;
        if (type == 1) {
            this.searchOptionEvents = true;
            this.searchOptionSpeakers = false;
        } else if (type == 2) {
            this.searchOptionEvents = false;
            this.searchOptionSpeakers = true;
        } else {
            this.searchOptionEvents = false;
            this.searchOptionSpeakers = false;
        }
    }

    filterTopics(event) {
        let query = event.query;
        this.campusAdminService.getTopics().subscribe(topics => {
            this.filteredTopics = this.filterTopic(query, topics);
        });
    }

    filterTopic(query, topics: any[]) {
        let filtered: any[] = [];
        for (let i = 0; i < topics.length; i++) {
            let topic = topics[i];
            if (topic.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(topic);
            }
        }
        return filtered;
    }

}