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
var dataset_service_1 = require("../../../../../services/dataset/dataset.service");
var topic_service_1 = require("../../../../../services/topic/topic.service");
var publicador_service_1 = require("../../../../../services/publicador/publicador.service");
var EditDatasetComponent = (function () {
    function EditDatasetComponent(datasetService, topicService, publicadoresService) {
        this.datasetService = datasetService;
        this.topicService = topicService;
        this.publicadoresService = publicadoresService;
        this.topics = [];
        this.value = 0;
        this.checked = false;
        this.editEnable = false;
        this.baseUrl = '';
        this.editableUrl = '';
        this.publicadores = [];
        this.uploadedFiles = [];
    }
    EditDatasetComponent.prototype.ngOnInit = function () {
        this.dataset = this.datasetService.getDataset();
        this.dataset.untilDate = new Date;
        this.setTopics(this.topicService.getTopics());
        this.selectedTopic = this.dataset.topic.name;
        this.files = [];
        this.languajes = ['Español', 'Inglés', 'Francés', 'Lenguas aragonesas', 'Otro'];
        this.freq = [
            { label: "Anual", value: 'Anual' },
            { label: "Semestral", value: 'Semestral' },
            { label: "Cuatrimestral", value: 'Cuatrimestral' },
            { label: "Trimestral", value: 'Trimestral' },
            { label: "Mensual", value: 'Mensual' },
        ];
        this.accesoRecurso = [
            { label: 'Enlace a un archivo público', value: '0' },
            { label: 'Vista de basede datos', value: '1' },
            { label: 'Sube fichero a AOD', value: '2' }
        ];
        this.vistas = [
            { label: 'Elecciones', value: '0' },
            { label: 'Símbolos', value: '1' },
            { label: 'Pleno municipio', value: '2' }
        ];
        this.formatos = [
            { label: 'JSON', value: '0' },
            { label: 'XML', value: '1' },
            { label: 'CSV', value: '2' },
            { label: 'RDF', value: '3' }
        ];
        this.accessModes = [
            { label: 'CSV', value: '0' },
            { label: 'DGN', value: '1' },
            { label: 'DWG', value: '2' }
        ];
        this.setPublicadores(this.publicadoresService.getPublicadores());
        this.selectedPublicador = this.dataset.publicador.name;
        this.urlsCalidad = [''];
        this.splitted = this.dataset.url.split('/');
        this.editableUrl = this.splitted[this.splitted.length - 1];
        this.splitted.splice(this.splitted.length - 1, 1);
        this.baseUrl = this.splitted.join('/') + '/';
    };
    EditDatasetComponent.prototype.edit = function () {
        this.editEnable = !this.editEnable;
    };
    EditDatasetComponent.prototype.save = function () {
        this.editEnable = !this.editEnable;
    };
    EditDatasetComponent.prototype.setPublicadores = function (publicadores) {
        for (var i = 0; i < publicadores.length; i++) {
            this.publicadores.push({ label: publicadores[i].name, value: publicadores[i].name });
        }
    };
    EditDatasetComponent.prototype.setTopics = function (topics) {
        for (var i = 0; i < topics.length; i++) {
            this.topics.push({ label: topics[i].name, value: topics[i].name });
        }
    };
    EditDatasetComponent.prototype.onUpload = function (event) {
        for (var _i = 0, _a = event.files; _i < _a.length; _i++) {
            var file = _a[_i];
            this.uploadedFiles.push(file);
        }
    };
    EditDatasetComponent.prototype.deleteFile = function (index) {
        this.files.splice(index, 1);
    };
    EditDatasetComponent.prototype.addFile = function () {
        this.files.push("");
    };
    return EditDatasetComponent;
}());
EditDatasetComponent = __decorate([
    core_1.Component({
        selector: 'app-edit-dataset',
        templateUrl: './edit-dataset.component.html',
        styleUrls: ['./edit-dataset.component.css']
    }),
    __metadata("design:paramtypes", [dataset_service_1.DatasetService, topic_service_1.TopicService, publicador_service_1.PublicadorService])
], EditDatasetComponent);
exports.EditDatasetComponent = EditDatasetComponent;
//# sourceMappingURL=edit-dataset.component.js.map