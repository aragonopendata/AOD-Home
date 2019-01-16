import { Component, OnInit } from '@angular/core';
import { Content } from '../../../../models/campus/Content';
import { CampusAdminService } from '../../../../services/admin/campus-admin.service';
import { Speaker } from '../../../../models/campus/Speaker';
import { Event } from '../../../../models/campus/Event';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectItem } from 'primeng/primeng';
import { Topic } from '../../../../models/campus/Topic';
import { Constants } from '../../../../app.constants';

@Component({
    selector: 'app-campus-admin-entries',
    templateUrl: './campus-admin-entries.component.html',
    styleUrls: ['./campus-admin-entries.component.css']
})
export class CampusAdminEntriesComponent implements OnInit {

    errorTitle: string;
    errorMessage: string;
    openDataErrorTitle: string;
    openDataErrorMessage: string;

    display: boolean;
    isNewEntry: boolean = false;
    entries: Content[];
    entriesCopy: Content[];
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
    messages: any[];
    emptyMessage: string;
    uniqueTopicStatusInserts: number[];
    uniqueTopicStatusDeletes: any[];

    constructor(private campusAdminService: CampusAdminService, public sanitizer: DomSanitizer) {
        this.display = false;
        this.entries = [];
        this.selectedEntry = new Content();
        this.emptyMessage = 'No se han encontrado resultados';
    }

    ngOnInit() {
        this.openDataErrorTitle = Constants.OPEN_DATA_STATIC_CONTENT_ERROR_TITLE;
        this.openDataErrorMessage = Constants.OPEN_DATA_STATIC_CONTENT_ERROR_MESSAGE;
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
            try {
                this.entries = result;
            } catch{
                console.error('Error: getEntries() - campus-admin-entries.component.ts');
                this.errorTitle = this.openDataErrorTitle;
                this.errorMessage = this.openDataErrorMessage;
            }
        });
    }

    getEntriesByEvent() {
        if (this.selectedEvent) {
            this.campusAdminService.getEntriesByEvent(this.selectedEvent).subscribe(result => {
                try {
                    this.entries = result;
                } catch{
                    console.error('Error: getEntriesByEvent() - campus-admin-entries.component.ts');
                    this.errorTitle = this.openDataErrorTitle;
                    this.errorMessage = this.openDataErrorMessage;
                }
            });
        } else {
            this.getEntries();
        }
    }

    getEntriesBySpeaker() {
        if (this.selectedSpeaker) {
            this.campusAdminService.getEntriesBySpeaker(this.selectedSpeaker).subscribe(result => {
                try {
                    this.entries = result;
                } catch{
                    console.error('Error: getEntriesBySpeaker() - campus-admin-entries.component.ts');
                    this.errorTitle = this.openDataErrorTitle;
                    this.errorMessage = this.openDataErrorMessage;
                }
            });
        } else {
            this.getEntries();
        }
    }

    getEntry(id) {
        this.topicStatusInserts = [];
        this.topicStatusDeletes = [];
        this.campusAdminService.getEntry(id).subscribe(result => {
            try {
                this.selectedEntry = result;
                this.topics = [];
                if (this.selectedEntry.topics) {
                    this.selectedEntry.topics.forEach(topic => {
                        this.topics.push({ id: topic.id, name: topic.name });
                    });
                }
            } catch{
                console.error('Error: getEntry() - campus-admin-entries.component.ts');
                this.errorTitle = this.openDataErrorTitle;
                this.errorMessage = this.openDataErrorMessage;
            }
        });
    }

    getEvents() {
        this.campusAdminService.getEvents().subscribe(result => {
            try {
                this.events = result;
                this.events.forEach(event => {
                    this.searchByEvent.push({ value: event.id, label: event.name });
                });
            } catch{
                console.error('Error: getEvents() - campus-admin-entries.component.ts');
                this.errorTitle = this.openDataErrorTitle;
                this.errorMessage = this.openDataErrorMessage;
            }
        });
    }

    getSpeakers() {
        this.campusAdminService.getSpeakers().subscribe(result => {
            try {
                this.speakers = result;
                this.speakers.forEach(speaker => {
                    this.searchBySpeaker.push({ value: speaker.id, label: speaker.name });
                });
            } catch{
                console.error('Error: getSpeakers() - campus-admin-entries.component.ts');
                this.errorTitle = this.openDataErrorTitle;
                this.errorMessage = this.openDataErrorMessage;
            }
        });
    }

    getFormats() {
        this.campusAdminService.getFormats().subscribe(result => {
            try {
                this.formats = result;
            } catch{
                console.error('Error: getFormats() - campus-admin-entries.component.ts');
                this.errorTitle = this.openDataErrorTitle;
                this.errorMessage = this.openDataErrorMessage;
            }
        });
    }

    getTypes() {
        this.campusAdminService.getTypes().subscribe(result => {
            try {
                this.types = result;
            } catch{
                console.error('Error: getTypes() - campus-admin-entries.component.ts');
                this.errorTitle = this.openDataErrorTitle;
                this.errorMessage = this.openDataErrorMessage;
            }
        });
    }

    getPlatforms() {
        this.campusAdminService.getPlatforms().subscribe(result => {
            try {
                this.platforms = result;
            } catch{
                console.error('Error: getPlatforms() - campus-admin-entries.component.ts');
                this.errorTitle = this.openDataErrorTitle;
                this.errorMessage = this.openDataErrorMessage;
            }
        });
    }

    addEntry() {
        this.isNewEntry = true;
        this.selectedEntry = new Content();
        this.selectedEntry.topics = [];
        this.topics = [];
        this.showDialog(this.selectedEntry);
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

    save(entry: Content) {
        if (this.validation(entry)) {
            if (this.isNewEntry) {
                let id_topics = [];
                this.setIdTopics(entry, id_topics);
                this.callInsertEntryService(entry, id_topics);
            } else {
                this.setTopicStatus();
                this.callUpdateEntryService(entry);
            }
            this.isNewEntry = false;
            this.display = !this.display;
        } else {
            this.showMessage('warn',
                '¡ATENCIÓN!',
                'No se han introducido todos los campos obligatorios'
            );
        }
    }

    validation(entry: Content) {
        let validated = false;
        if (entry.title != null && entry.title != undefined && entry.title.length > 0 &&
            entry.platform != null && entry.platform != undefined &&
            entry.format != null && entry.format != undefined &&
            entry.event != null && entry.event != undefined &&
            entry.speaker_id != null && entry.speaker_id != undefined &&
            entry.topics != null && entry.topics != undefined && entry.topics.length > 0) {
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
        this.selectedEntry.topics.push({ id: event.id, name: event.name });
        this.topicStatusInserts.push(event.id);
    }

    setTopic(event) {
        let topic: Topic = new Topic();
        topic.id = event.id;
        topic.name = event.name;
        this.selectedEntry.topics.push(topic);
    }

    setIdTopics(entry, id_topics) {
        entry.topics.forEach(topic => {
            id_topics.push(topic.id);
        });
    }

    setTopicStatus() {
        this.uniqueTopicStatusInserts = this.topicStatusInserts.filter(this.isRepeated);
        this.uniqueTopicStatusDeletes = this.topicStatusDeletes.filter(this.isRepeated);
        this.topicStatus['inserts'] = this.uniqueTopicStatusInserts;
        this.topicStatus['deletes'] = this.uniqueTopicStatusDeletes;
    }

    addDeletedTopic(event) {
        this.selectedEntry.topics.splice(this.topics.indexOf(event), 1);
        this.topicStatusDeletes.push(event.id);
    }

    callInsertEntryService(entry, id_topics) {
        this.campusAdminService.insertNewEntry(entry, id_topics).subscribe(result => {
            if (result.status == 200 && result.success) {
                let auxEntry = new Content();
                auxEntry.id = result.id;
                auxEntry.title = entry.title;
                this.entries.push(auxEntry);
                this.refreshTable();
                this.showMessage('success',
                    'Inserción de entrada',
                    'Entrada añadida correctamente'
                );
                this.topics = [];
            } else {
                this.showMessage('error',
                    'Inserción de entrada',
                    'Error al añadir la entrada'
                );
            }
        });
    }

    callUpdateEntryService(entry) {
        this.campusAdminService.updateEntry(entry, this.topicStatus).subscribe(result => {
            if (result.status == 200 && result.success) {
                this.showMessage('success',
                    'Actualización de entrada',
                    'Entrada actualizada correctamente'
                );
            } else {
                this.showMessage('error',
                    'Actualización de entrada',
                    'Error al actualizar la entrada'
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
        this.entriesCopy = Object.assign([], this.entries);
        this.entries = this.entriesCopy;
    }

}