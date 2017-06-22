import { Component, OnInit } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-global-home',
  templateUrl: './global-home.component.html',
  styleUrls: ['./global-home.component.css']
})
export class GlobalHomeComponent implements OnInit {

  hovers: any[] = [];

  constructor() { }

  ngOnInit() {
    this.hovers = [
      { id: '#imgBD', hover: false },
      { id: '#imgTem', hover: false },
      { id: '#imgPub', hover: false },
      { id: '#imgAragopedia', hover: false },
      { id: '#imgPre', hover: false },
      { id: '#imgOSD', hover: false },
      { id: '#imgCRAs', hover: false },
      { id: '#imgInfo', hover: false },
      { id: '#imgApp', hover: false },
      { id: '#imgEv', hover: false },
      { id: '#imgCol', hover: false },
      { id: '#imgCampus', hover: false },
      { id: '#imgDesa', hover: false },
      { id: '#imgAPIs', hover: false },
      { id: '#imgSPARQL', hover: false },
      { id: '#imgGit', hover: false }
    ];
  }

  move(i) {
    $("html, body").animate({ scrollTop: window.innerHeight * i }, '1000');
  }

  hover (id, src) {
      for (let hover of this.hovers){
        if(hover.id === id) {
          hover.hover = !hover.hover;
        }
      }
      $(id).fadeOut(500, function() {
        $(id).attr("src", src);
        $(id).fadeIn(500);
    });
  }

  unhover(id, src) {
    for (let hover of this.hovers){
        if(hover.id === id) {
          hover.hover = !hover.hover;
        }
      }
    $(id).fadeOut(500, function() {
        $(id).attr("src", src);
        $(id).fadeIn(500);
    });
  }

}
