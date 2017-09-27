import * as $ from 'jquery';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../../app.component';
import { ConstantsService } from '../../../../app.constants';
import { Dataset } from "app/models/Dataset";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs";
import { Autocomplete } from "app/models/Autocomplete";
import { Router } from "@angular/router";
import { DatasetsService } from "app/services/web/datasets.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    aodBaseUrl: String;
    presupuestosBaseUrl: String;
    menuActive: boolean = false;
    srcMenu: String = '../../../assets/Boton-Menu-Responsive-OFF.png';
    srcLogin: String = '../../../assets/Boton-Acceso-Usuarios-OFF.png';
    dataset: Dataset;
	datasetAutocomplete: Autocomplete[];
	private datasetTitle = new Subject<string>();
	private resultsLimit: number;

    constructor(private locale: AppComponent, private constants: ConstantsService,
            private datasetService: DatasetsService, private router: Router) { 
        this.aodBaseUrl = this.constants.AOD_BASE_URL;
        this.presupuestosBaseUrl = this.constants.PRESUPUESTOS_BASE_URL;
        this.resultsLimit=4;
    }

    openNav() {
        console.log(this.menuActive);
        if (!this.menuActive) {
            $('body,html').css('overflow-y', 'hidden');
            $('.overlay').css('top', $('#header').height());
            $('#myNav').height($(window).height() - $('#header').height());
            $('#logo').attr('src', '../../../assets/AOD-Logo-Responsive.png');
            this.menuActive = !this.menuActive;
            $('#nav').attr('class', 'navbar navbar-toggleable-md bg-inverse');
            $('#nav').css('background-color', 'rgba(0,0,0, 0.82)');
            this.srcLogin = '../../../assets/Boton-Acceso-Usuarios-gris.png';
            this.srcMenu = '../../../assets/Boton-Salir-Menu-Responsive-OFF.png';
        } else {
            $('body,html').css('overflow-y', 'auto');
            $('#myNav').height('0%');
            $('#nav').attr('class', 'navbar navbar-toggleable-md bg-light');
            $('#logo').attr('src', '../../../assets/AOD-Logo.png');
            $('#searchBox').val('');
            this.menuActive = !this.menuActive;
            this.srcLogin = '../../../assets/Boton-Acceso-Usuarios-OFF.png';
            this.srcMenu = '../../../assets/Boton-Menu-Responsive-OFF.png';
            this.datasetAutocomplete = [];
        }
    }

    hover(id) {
        if (this.menuActive) {
            if (id === '#login') {
                this.srcLogin = '../../../assets/Boton-Acceso-Usuarios-blanco.png';
            } else if (id === '#menu') {
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
            } else if (id === '#menu') {
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

    search(title: string): void {
		//Lectura cuando hay al menos 3 caracteres, (3 espacios produce error).
		if (title.length >= 3) {
			this.datasetTitle.next(title);
		} else {
			this.datasetAutocomplete = null;
		}
	}

	getAutocomplete(): void {
		//Funciona la busqueda, falla al poner un caracter especial
		this.datasetTitle
			.debounceTime(100)
			.distinctUntilChanged()
			.switchMap(title => title
				? this.datasetService.getDatasetsAutocomplete(title, this.resultsLimit)
				: Observable.of<Autocomplete[]>([]))
			.catch(error => {
				console.log(error);
				return Observable.of<Autocomplete[]>([]);
			}).subscribe(data =>
				this.datasetAutocomplete = JSON.parse(data).result);
	}

    focusUserName(){
        document.getElementById("loginLink").blur();
    }

    searchDatasetsByText(text: string){
		this.router.navigate(['/datos/catalogo'], { queryParams: { texto: text} });
	}

    ngOnInit() {
        this.getAutocomplete();
    }

}
