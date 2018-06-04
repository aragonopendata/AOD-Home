import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-info-list-admin',
  templateUrl: './info-list-admin.component.html',
  styleUrls: ['./info-list-admin.component.css']
})
export class InfoListAdminComponent implements OnInit {

  public static doUpdate: Subject<any> = new Subject();

  constructor() { }

  ngOnInit() {
  }

}
