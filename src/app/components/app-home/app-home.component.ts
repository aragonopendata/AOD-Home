import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css']
})
export class AppHomeComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {
    
  }

  openNav() {
    document.getElementById("myNav").style.height = "100%";
  }

  closeNav() {
    document.getElementById("myNav").style.height = "0%";
  }

  collapse() {
    
  }
}
