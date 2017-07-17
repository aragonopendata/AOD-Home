import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css']
})
export class AppHomeComponent implements OnInit {

  hovers: any[] = [];

  constructor() {
    this.hovers = [
      { id: '#login', hover: false },
      { id: '#menu', hover: false },
      { id: '#loginActive', hover: false },
      { id: '#menuActive', hover: false }
    ];
  }

  ngOnInit() {
    
  }

  openNav() {
    $('#myNav').height('100%');
    $('#nav').attr('class', 'navbar navbar-toggleable-md navbar-light bg-inverse');
    $('#logo').attr('src', '../assets/AOD-Logo-Responsive.png');
    $('#menu').attr('src', '../../../assets/Boton-Salir-Menu-Responsive-OFF.png');
    $('#login').attr('src', '../../../assets/Boton-Acceso-Usuarios-gris.png');
    $("#login").mouseenter(function(){
        this.hover('#login', '../../../assets/Boton-Acceso-Usuarios-blanco.png');
    });
    $("#login").mouseleave(function(){
        this.unhover('#login', '../../../assets/Boton-Acceso-Usuarios-gris.png');
    });
  }

  closeNav() {
    $('#myNav').height('0%');
    $('#nav').attr('class', 'navbar navbar-toggleable-md navbar-light bg-faded');
    $('#logo').attr('src', '../assets/AOD-Logo.png');
    $('#menu').attr('src', '../../../assets/Boton-Menu-Responsive-OFF.png');
    $('#login').attr('src', '../../../assets/Boton-Acceso-Usuarios-OFF.png');
  }

  hover (id, src) {
      for (let hover of this.hovers){
        if(hover.id === id) {
          hover.hover = !hover.hover;
        }
      }
      $(id).fadeOut(200, function() {
        $(id).attr("src", src);
        $(id).fadeIn(200);
    });
  }

  unhover(id, src) {
    for (let hover of this.hovers){
        if(hover.id === id) {
          hover.hover = !hover.hover;
        }
      }
    $(id).fadeOut(200, function() {
        $(id).attr("src", src);
        $(id).fadeIn(200);
    });
  }
}
