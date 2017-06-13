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
var Publicador_1 = require("../../models/Publicador");
var PublicadorService = (function () {
    function PublicadorService() {
        this.publicadores = [
            new Publicador_1.Publicador("Dirección de Comunicación"),
            new Publicador_1.Publicador("Dirección General de Administración Electrónica y Sociedad de la Información"),
            new Publicador_1.Publicador("Dirección General de Administración Local"),
            new Publicador_1.Publicador("Dirección General de Contratación, Patrimonio y Organización"),
            new Publicador_1.Publicador("Dirección General de Cultura y Patrimonio"),
            new Publicador_1.Publicador("Dirección General de Industria, PYMES, Comercio y Artesanía"),
            new Publicador_1.Publicador("Dirección General de Movilidad e Infraestructuras"),
            new Publicador_1.Publicador("Dirección General de Planificación y Formación Profesional"),
            new Publicador_1.Publicador("Dirección General de Presupuestos, Financiación y Tesorería"),
            new Publicador_1.Publicador("Dirección General de Producción Agraria"),
            new Publicador_1.Publicador("Dirección General de Protección de Consumidores y Usuarios"),
            new Publicador_1.Publicador("Dirección General de Relaciones Institucionales y Desarrollo Estatutario"),
            new Publicador_1.Publicador("Dirección General de Sostenibilidad"),
            new Publicador_1.Publicador("Dirección General de Trabajo")
        ];
    }
    PublicadorService.prototype.getPublicadores = function () {
        return this.publicadores;
    };
    return PublicadorService;
}());
PublicadorService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], PublicadorService);
exports.PublicadorService = PublicadorService;
//# sourceMappingURL=publicador.service.js.map