import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';


@Component({
    selector: 'app-app-home',
    templateUrl: './app-home.component.html',
    styleUrls: ['./app-home.component.css']
})
export class AppHomeComponent implements OnInit {

    menuActive: boolean = false;
    srcMenu: String = '../../../assets/Boton-Menu-Responsive-OFF.png';
    srcLogin: String = '../../../assets/Boton-Acceso-Usuarios-OFF.png';

    constructor() {

    }

    ngOnInit() {

    }

    openNav() {
        if (!this.menuActive) {
            $('#myNav').height('100%');
            $('#logo').attr('src',  '../../../assets/AOD-Logo-Responsive.png');
            this.menuActive = !this.menuActive;
            $('#nav').attr('class',  'navbar navbar-toggleable-md bg-inverse');
            this.srcLogin = '../../../assets/Boton-Acceso-Usuarios-gris.png';
            this.srcMenu = '../../../assets/Boton-Salir-Menu-Responsive-OFF.png';
        } else {
            $('#myNav').height('0%');
            $('#nav').attr('class', 'navbar navbar-toggleable-md bg-light');
            $('#logo').attr('src',  '../../../assets/AOD-Logo.png');
            this.menuActive = !this.menuActive;
            this.srcLogin = '../../../assets/Boton-Acceso-Usuarios-OFF.png';
            this.srcMenu = '../../../assets/Boton-Menu-Responsive-OFF.png';
        }
    }

    hover(id) {
        if (this.menuActive) {
            if (id === '#login') {
                this.srcLogin = '../../../assets/Boton-Acceso-Usuarios-blanco.png';
            } else if (id === '#menu'){
                this.srcMenu = '../../../assets/Boton-Salir-Menu-Responsive-ON.png';
            }
        } else {
            if (id === '#login') {
                this.srcLogin = '../../../assets/Boton-Acceso-Usuarios-ON.png';
            } else if (id === '#menu') {
                this.srcMenu = '../../../assets/Boton-Menu-Responsive-ON.jpg';
            }
        }
    }

    unhover(id) {
        if (this.menuActive) {
            if (id === '#login') {
                this.srcLogin = '../../../assets/Boton-Acceso-Usuarios-gris.png';
            } else if (id === '#menu'){
                this.srcMenu = '../../../assets/Boton-Salir-Menu-Responsive-OFF.png';
            }
        } else {
            if (id === '#login') {
                this.srcLogin = '../../../assets/Boton-Acceso-Usuarios-OFF.png';
            } else if (id === '#menu') {
                this.srcMenu = '../../../assets/Boton-Menu-Responsive-OFF.png';
            }
        }
    }
}
