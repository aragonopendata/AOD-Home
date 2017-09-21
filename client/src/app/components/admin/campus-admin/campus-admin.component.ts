import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-campus-admin',
    templateUrl: './campus-admin.component.html',
    styleUrls: ['./campus-admin.component.css']
})
export class CampusAdminComponent implements OnInit {

    titulos: string;

    tipos: SelectItem[];
    etiquetas: SelectItem[];
    formatos: SelectItem[];
    eventos: SelectItem[];
    ponentes: SelectItem[];

    elementos: any;

    constructor(private route: ActivatedRoute) {
        this.tipos = [];
        this.tipos.push({ label: 'Tipo', value: null });
        this.tipos.push({ label: 'Curso', value: 'Curso' });
        this.tipos.push({ label: 'Debate', value: 'Debate' });
        this.tipos.push({ label: 'Entrevista', value: 'Entrevista' });

        this.etiquetas = [];
        this.etiquetas.push({ label: 'Etiqueta', value: null });
        this.etiquetas.push({ label: 'API', value: 'API' });
        this.etiquetas.push({ label: 'APP', value: 'APP' });
        this.etiquetas.push({ label: 'Aragón Radio', value: 'Aragón Radio' });

        this.formatos = [];
        this.formatos.push({ label: 'Formato', value: null });
        this.formatos.push({ label: 'Infografía', value: 'Infografía' });
        this.formatos.push({ label: 'Podcast', value: 'Podcast' });
        this.formatos.push({ label: 'Presentación', value: 'Presentación' });
        this.formatos.push({ label: 'Video', value: 'Video' });

        this.eventos = [];
        this.eventos.push({ label: 'Evento', value: null });
        this.eventos.push({ label: 'Evento 1', value: 'Evento 1' });
        this.eventos.push({ label: 'Evento 2', value: 'Evento 2' });
        this.eventos.push({ label: 'Evento 3', value: 'Evento 3' });

        this.ponentes = [];
        this.ponentes.push({ label: 'Ponente', value: null });
        this.ponentes.push({ label: 'Ponente 1', value: 'Ponente 1' });
        this.ponentes.push({ label: 'Ponente 2', value: 'Ponente 2' });
        this.ponentes.push({ label: 'Ponente 3', value: 'Ponente 3' });

        this.elementos = [];
        this.elementos.push({
            titulo: 'Título 1',
            ponentes: 'Ponente 1',
            eventos: 'Evento 1',
            formatos: this.formatos[1].value,
            etiquetas: this.etiquetas[2].value,
            tipos: this.tipos[1].value
        });
    }

    ngOnInit() {
    }

}
