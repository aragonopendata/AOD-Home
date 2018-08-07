import { Component, OnInit, ViewChild } from '@angular/core';
import { CampusService } from '../../../../services/web/campus.service';
import { CampusAdminService } from '../../../../services/admin/campus-admin.service';
import { Event } from '../../../../models/campus/Event';
import { RESOURCE_CACHE_PROVIDER } from '@angular/platform-browser-dynamic';
import { DateAdapter } from '@angular/material';
import { SelectItem, Paginator } from 'primeng/primeng';
import { Content } from '../../../../models/campus/Content';


@Component({
  selector: 'app-campus-admin-events',
  templateUrl: './campus-admin-events.component.html',
  styleUrls: ['./campus-admin-events.component.css']
})
export class CampusAdminEventsComponent implements OnInit {

  events: Event[];
  eventSelected: Event;
  isNewEvent: boolean;
  display: boolean;
  date: Date;
  sites: any[];
  selectedSite: any;
  totalRecords: number;
  contentsPaginated: Content[];
  @ViewChild('p') paginator: Paginator;

  constructor(private campusService: CampusService,
    private campusAdminService: CampusAdminService) {
    this.display = false;
    this.eventSelected = new Event();
  }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.campusAdminService.getEvents().subscribe(result => {
      this.events = result;
      this.getSites();
    });
  }

  //TODO: Fechas
  /*setDate(event){
      let date = event.date;
      date.setMinutes( date.getMinutes() + date.getTimezoneOffset() );
      event.date = date;
  }*/

  showDialog(event) {
    this.display = !this.display;
    //this.setDate(event);
    this.eventSelected = event;
    this.getContentsEvents(this.eventSelected);
    this.selectedSite = this.eventSelected.site;
  }

  cancel(event) {
    this.display = !this.display;
    this.isNewEvent = false;
    this.eventSelected = new Event();
    this.paginator.changePageToFirst(event);
  }

  getContentsEvents(event) {
    this.campusAdminService.getContentsEvents(event.id).subscribe(result => {
      event.contents = result;
      this.totalRecords = this.eventSelected.contents.length;
      this.contentsPaginated = this.eventSelected.contents.slice(0, 3);
    });
  }

  paginate(event) {
    this.contentsPaginated = this.eventSelected.contents.slice(event.first, event.first + parseInt(event.rows));
  }
  
  getSites() {
    this.campusAdminService.getSites().subscribe(result => {
      this.sites = result;
    });
  }

  addEvent() {
    this.isNewEvent = true;
    this.showDialog(new Event());
  }

  save(event) {
    let site_id = this.sites[this.sites.findIndex(element => element.name == event.site)].id;
    if (this.isNewEvent) {
      this.campusAdminService.insertNewEvent(event, site_id).subscribe();
    } else {
      this.campusAdminService.updateEvent(event, site_id).subscribe();
    }
    this.isNewEvent = false;
    this.display = !this.display;
  }

}