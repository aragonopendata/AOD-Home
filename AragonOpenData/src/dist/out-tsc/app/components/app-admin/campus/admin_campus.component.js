"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var CampusComponent = (function () {
    function CampusComponent(route) {
        this.route = route;
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
    CampusComponent.prototype.ngOnInit = function () {
    };
    return CampusComponent;
}());
CampusComponent = __decorate([
    core_1.Component({
        selector: 'app-admincampus',
        templateUrl: './admin_campus.component.html',
        styleUrls: ['./admin_campus.component.css']
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute])
], CampusComponent);
exports.CampusComponent = CampusComponent;
//# sourceMappingURL=admin_campus.component.js.map