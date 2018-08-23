import { Component, OnInit, ViewChild } from '@angular/core';
import { CampusService } from '../../../../services/web/campus.service';
import { CampusAdminService } from '../../../../services/admin/campus-admin.service';
import { Event } from '../../../../models/campus/Event';
import { Paginator, ConfirmationService, AutoComplete } from 'primeng/primeng';
import { Constants } from '../../../../app.constants';

@Component({
    selector: 'app-campus-admin-events',
    templateUrl: './campus-admin-events.component.html',
    styleUrls: ['./campus-admin-events.component.css']
})
export class CampusAdminEventsComponent implements OnInit {

    errorTitle: string;
    errorMessage: string;
    openDataErrorTitle: string;
    openDataErrorMessage: string;
    messages: any[];

    emptyMessage: string;

    events: Event[];
    eventsCopy: Event[];
    eventSelected: Event;
    isNewEvent: boolean;
    display: boolean;
    date: Date;
    sites: any[];
    filteredSites: any[];
    @ViewChild('p') paginator: Paginator;
    @ViewChild('auto') autoComplete: AutoComplete;

    minDate: Date;
    maxDate: Date;
    es: any;
    tr: any;
    invalidDates: Array<Date>

    constructor(private campusService: CampusService,
        private campusAdminService: CampusAdminService,
        private confirmationService: ConfirmationService) {
        this.emptyMessage = 'No se han encontrado resultados';
        this.display = false;
        this.eventSelected = new Event();
    }

    ngOnInit() {
        this.openDataErrorTitle = Constants.OPEN_DATA_STATIC_CONTENT_ERROR_TITLE;
        this.openDataErrorMessage = Constants.OPEN_DATA_STATIC_CONTENT_ERROR_MESSAGE;
        this.initDates();
        this.getEvents();
    }

    getEvents() {
        this.campusAdminService.getEvents().subscribe(result => {
            try {
                this.events = result;
                this.getSites();
            } catch (error) {
                console.error('Error: getEvents() - campus-admin-events.component.ts');
                this.errorTitle = this.openDataErrorTitle;
                this.errorMessage = this.openDataErrorMessage;
            }
        });
    }

    showDialog(event) {
        this.display = !this.display;
        this.eventSelected = event;
        this.eventSelected.date = new Date(this.eventSelected.date);
    }

    cancel(event) {
        this.display = !this.display;
        this.isNewEvent = false;
        this.eventSelected = new Event();
    }

    getSites() {
        this.campusAdminService.getSites().subscribe(result => {
            try {
                this.sites = result;
            } catch{
                console.error('Error: getSites() - campus-admin-events.component.ts');
                this.errorTitle = this.openDataErrorTitle;
                this.errorMessage = this.openDataErrorMessage;
            }
        });
    }

    addEvent() {
        this.isNewEvent = true;
        this.eventSelected = new Event();
        this.eventSelected.date = new Date();
        this.showDialog(this.eventSelected);
    }

    save(event) {
        if (this.validation(event)) {
            let site_id = event.site.id;
            if (this.isNewEvent) {
                this.callInsertEventService(event, site_id);
            } else {
                this.callUpdateEventService(event, site_id);
            }
            this.isNewEvent = false;
            this.display = !this.display;
        } else {
            this.showMessage('warn',
                '¡ATENCIÓN!',
                'No se han introducido todos los campos obligatorios'
            );
        }
    }

    filterSites(event) {
        let query = event.query;
        this.campusAdminService.getSites().subscribe(sites => {
            this.filteredSites = this.filterSite(query, sites);
        });
    }

    filterSite(query, sites: any[]) {
        let filtered: any[] = [];
        for (let i = 0; i < sites.length; i++) {
            let site = sites[i];
            if (site.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(site);
            }
        }
        return filtered;
    }

    addSite(site) {
        this.callInsertSiteService(site);
    }

    confirm() {
        let newSite = this.autoComplete.inputEL.nativeElement.value;
        this.confirmationService.confirm({
            message: '¿Está seguro de que quiere añadir la nueva localización introducida?',
            header: 'Confirmación',
            accept: () => {
                this.addSite(newSite);
            },
            reject: () => {

            }
        });
    }

    initDates() {
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
            today: 'Hoy',
            clear: 'Borrar'
        }

        this.tr = {
            firstDayOfWeek: 1
        }

        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = (month === 0) ? 11 : month - 1;
        let prevYear = (prevMonth === 11) ? year - 1 : year;
        let nextMonth = (month === 11) ? 0 : month + 1;
        let nextYear = (nextMonth === 0) ? year + 1 : year;
        this.minDate = new Date();
        this.minDate.setMonth(prevMonth);
        this.minDate.setFullYear(prevYear);
        this.maxDate = new Date();
        this.maxDate.setMonth(nextMonth);
        this.maxDate.setFullYear(nextYear);

        let invalidDate = new Date();
        invalidDate.setDate(today.getDate() - 1);
        this.invalidDates = [today, invalidDate];
    }

    validation(event: Event) {
        let validated = false;
        if (event.name != null && event.name != undefined && event.name.length > 0
            && event.date != null && event.date != undefined
            && event.site != null && event.site != undefined) {
            validated = true;
        }
        return validated;
    }

    callInsertEventService(event, site_id) {
        this.campusAdminService.insertNewEvent(event, site_id).subscribe(result => {
            if (result.status == 200 && result.success) {
                event.id = result.id;
                this.transformDate(event);
                this.events.push(event);
                this.refreshTable();
                this.showMessage('success',
                    'Inserción de evento',
                    'Evento insertado correctamente'
                );
            } else {
                this.showMessage('error',
                    'Inserción de evento',
                    'Error al insertar el evento');
            }
        });
    }

    transformDate(event){
        let dateArray = [];
        dateArray = event.date.split('/');
        event.date = new Date(dateArray[dateArray.length - 1 ],
            dateArray[dateArray.length - 2 ] - 1,
            dateArray[dateArray.length - 3 ]
        );
    }

    callUpdateEventService(event, site_id) {
        this.campusAdminService.updateEvent(event, site_id).subscribe(result => {
            if (result.status == 200 && result.success) {
                this.showMessage('success',
                    'Actualización de evento',
                    'Evento actualizado correctamente'
                );
            } else {
                this.showMessage('error',
                    'Actualización de evento',
                    'Error al actualizar el evento'
                );
            }
        });
    }

    callInsertSiteService(site) {
        this.campusAdminService.insertNewSite(site).subscribe(result => {
            if (result.status == 200 && result.success) {
                this.showMessage('success',
                    'Inserción de localización',
                    'Localización añadida correctamente'
                );
            } else {
                this.showMessage('error',
                    'Inserción de localización',
                    'Error al añadir la localización'
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
        this.eventsCopy = Object.assign([], this.events);
        this.events = this.eventsCopy;
    }

}