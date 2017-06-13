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
var Dataset_1 = require("../../models/Dataset");
var topic_service_1 = require("../topic/topic.service");
var publicador_service_1 = require("../publicador/publicador.service");
var DatasetService = (function () {
    function DatasetService(topicService, publicadorService) {
        this.topicService = topicService;
        this.publicadorService = publicadorService;
        this.topics = this.topicService.getTopics();
        this.publicadores = this.publicadorService.getPublicadores();
        this.datasets = [
            new Dataset_1.Dataset('Encuesta sobre la implantación de TIC en Hogares de Zonas Blancas de Aragón. 2016', 'http://opendata.aragon.es/datos/encuesta-sobre-la-implantacion-de-tic-en-hogares-de-zonas-blancas-de-aragon-2016', 'Difusión de los datos sobre uso TIC en los hogares de las llamadas Zonas blancas de Aragón según la estadística' +
                'desarrollada por el Servicio de Nuevas tecnologías y Sociedad de la Información del Gobierno de Aragón.', this.topics[0], (new Date), this.publicadores[5]),
            new Dataset_1.Dataset('Uso de las TIC. Personas por sexo. Año 2015', 'http://opendata.aragon.es/datos/uso-de-las-tic-personas-por-sexo-ano-2015', 'Avance de resultados de la Encuesta TICH 2015, según la explotación del fichero de microdatos del INE,' +
                'que recoge los resultados principales de viviendas y personas acerca del uso de las tecnologías de la información y' +
                'comunicación en los hogares donde residen', this.topics[3], (new Date), this.publicadores[2])
        ];
    }
    DatasetService.prototype.getDatasets = function () {
        return this.datasets;
    };
    DatasetService.prototype.setDataset = function (dataset) {
        this.dataset = dataset;
    };
    DatasetService.prototype.getDataset = function () {
        return this.dataset;
    };
    DatasetService.prototype.addToCollection = function (dataset) {
        if (this.datasets.indexOf(dataset) !== -1) {
            return;
        }
        this.datasets.push(dataset);
    };
    DatasetService.prototype.removeDataset = function (dataset) {
        this.datasets.splice(this.datasets.indexOf(dataset), 1);
    };
    return DatasetService;
}());
DatasetService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [topic_service_1.TopicService, publicador_service_1.PublicadorService])
], DatasetService);
exports.DatasetService = DatasetService;
//# sourceMappingURL=dataset.service.js.map