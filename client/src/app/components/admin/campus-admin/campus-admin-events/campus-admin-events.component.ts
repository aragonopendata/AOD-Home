import { Component, OnInit, ViewChild } from '@angular/core';
import { CampusService } from '../../../../services/web/campus.service';
import { CampusAdminService } from '../../../../services/admin/campus-admin.service';
import { Event } from '../../../../models/campus/Event';
import { Paginator, ConfirmationService, AutoComplete } from 'primeng/primeng';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-campus-admin-events',
  templateUrl: './campus-admin-events.component.html',
  styleUrls: ['./campus-admin-events.component.css'],
  providers: [DatePipe]
})
export class CampusAdminEventsComponent implements OnInit {

  emptyMessage: string;

  events: Event[];
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
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe) {
    this.emptyMessage = 'No se han encontrado resultados';
    this.display = false;
    this.eventSelected = new Event();
  }

  ngOnInit() {
    this.initDates();
    this.getEvents();
  }

  getEvents() {
    this.campusAdminService.getEvents().subscribe(result => {
      this.events = result;
      this.getSites();
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
      this.sites = result;
    });
  }

  addEvent() {
    this.isNewEvent = true;
    this.eventSelected = new Event();
    this.eventSelected.date = new Date();
    this.showDialog(this.eventSelected);
  }

  save(event) {
    let site_id = event.site.id;
    event.date = this.datePipe.transform(event.date, 'dd/MM/yyyy');
    if (this.isNewEvent) {
      this.campusAdminService.insertNewEvent(event, site_id).subscribe();
    } else {
      this.campusAdminService.updateEvent(event, site_id).subscribe();
    }
    this.isNewEvent = false;
    this.display = !this.display;
    this.eventSelected = new Event();
    this.eventSelected.date = new Date(event.date);
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
    this.campusAdminService.insertNewSite(site).subscribe();
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

}