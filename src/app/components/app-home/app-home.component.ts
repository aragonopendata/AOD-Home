import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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

    constructor(private router: Router) { }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });
    }

    openNav() {
        if (!this.menuActive) {
            $('body,html').css('overflow-y','hidden');
            $('.overlay').css('top', $('#header').height());
            $('#myNav').height($(window).height() - $('#header').height());
            $('#logo').attr('src',  '../../../assets/AOD-Logo-Responsive.png');
            this.menuActive = !this.menuActive;
            $('#nav').attr('class',  'navbar navbar-toggleable-md bg-inverse');
            this.srcLogin = '../../../assets/Boton-Acceso-Usuarios-gris.png';
            this.srcMenu = '../../../assets/Boton-Salir-Menu-Responsive-OFF.png';
        } else {
            $('body,html').css('overflow-y','auto');
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