import { Component, OnInit } from '@angular/core';
import { CampusService } from '../../../../services/web/campus.service';
import { CampusAdminService } from '../../../../services/admin/campus-admin.service';

@Component({
  selector: 'app-campus-admin-events',
  templateUrl: './campus-admin-events.component.html',
  styleUrls: ['./campus-admin-events.component.css']
})
export class CampusAdminEventsComponent implements OnInit {

  events: Event[];
  eventSelected: Event;
  display: boolean = false;

  constructor(private campusService: CampusService, private campusAdminService: CampusAdminService) {

  }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.campusAdminService.getEvents().subscribe(result => {
      this.events = result;
    });
  }

}