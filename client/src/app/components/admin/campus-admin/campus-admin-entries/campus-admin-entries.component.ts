import { Component, OnInit } from '@angular/core';
import { Content } from '../../../../models/campus/Content';
import { CampusAdminService } from '../../../../services/admin/campus-admin.service';
import { Speaker } from '../../../../models/campus/Speaker';
import { Event } from '../../../../models/campus/Event';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectItem } from 'primeng/primeng';
import { Topic } from '../../../../models/campus/Topic';

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
    formats: any[] = [];
    types: any[] = [];
    platforms: any[] = [];
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
    topicStatus: any = {};
    topicStatusInserts: number[] = [];
    topicStatusDeletes: number[] = [];
    msgs: any[];
    emptyMessage: string;

    constructor(private campusAdminService: CampusAdminService, public sanitizer: DomSanitizer) {
        this.display = false;
        this.entries = [];
        this.selectedEntry = new Content();
        this.emptyMessage = 'No se han encontrado resultados';
    }

    ngOnInit() {
        this.getEntries();
        this.setSearchTypes();
        this.setEventSearch();
        this.setSpeakerSearch();
        this.getFormats();
        this.getTypes();
        this.getPlatforms();
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
            this.topics = [];
            if (this.selectedEntry.topics) {
                this.selectedEntry.topics.forEach(topic => {
                    this.topics.push({ id: topic.id, name: topic.name });
                });
            }
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

    getFormats() {
        this.campusAdminService.getFormats().subscribe(result => {
            this.formats = result;
        });
    }

    getTypes() {
        this.campusAdminService.getTypes().subscribe(result => {
            this.types = result;
        });
    }

    getPlatforms() {
        this.campusAdminService.getPlatforms().subscribe(result => {
            this.platforms = result;
        });
    }

    addEntry() {
        this.isNewEntry = true;
        let newEntry = new Content();
        newEntry.topics = [];
        this.showDialog(newEntry);
    }

    showDialog(entry) {
        this.display = !this.display;
        if (!this.isNewEntry) {
            this.getEntry(entry.id);
        }
    }

    isRepeated(value, index, self) {
        return self.indexOf(value) === index;
    }

    save(entry) {
        if (this.validation(entry)) {
            if (this.isNewEntry) {
                let id_topics = [];
                entry.topics = [];
                entry.topics.forEach(topic => {
                    id_topics.push(topic.id);
                });
                this.campusAdminService.insertNewEntry(entry, id_topics).subscribe();
            } else {
                let uniqueTopicStatusInserts = this.topicStatusInserts.filter(this.isRepeated);
                let uniqueTopicStatusDeletes = this.topicStatusDeletes.filter(this.isRepeated);
                this.topicStatus['inserts'] = uniqueTopicStatusInserts;
                this.topicStatus['deletes'] = uniqueTopicStatusDeletes;
                this.campusAdminService.updateEntry(entry, this.topicStatus).subscribe();
            }
            this.isNewEntry = false;
            this.display = !this.display;
            this.getEntries();
        } else {
            this.showError();
        }
    }

    validation(entry) {
        let validated = false;
        if (entry.title && entry.platform && entry.format ||
            entry.event_id && entry.speaker_id && entry.topics) {
            validated = true;
        }
        return validated;
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

    addInsertedTopic(event) {
        if (this.isNewEntry) {
            this.setTopic(event);
        } else {
            this.topicStatusInserts.push(event.id);
        }
    }

    setTopic(event) {
        let topic: Topic = new Topic();
        topic.id = event.id;
        topic.name = event.name;
        this.selectedEntry.topics = [];
        this.selectedEntry.topics.push(topic);
    }
    
    addDeletedTopic(event) {
        this.topicStatusDeletes.push(event.id);
    }

    showError() {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error de validación', detail: 'No se han introducido todos los campos obligatorios.' });
    }

}