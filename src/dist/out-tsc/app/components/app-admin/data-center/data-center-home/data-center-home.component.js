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
var DataCenterHomeComponent = (function () {
    function DataCenterHomeComponent() {
        this.data = {
            labels: ['Calendario', 'Fotos', 'Hojas de cálculo', 'Mapas', 'Recursos Educativos', 'Recursos web'],
            datasets: [
                {
                    label: 'Organización 1',
                    backgroundColor: 'rgba(179,181,198,0.2)',
                    borderColor: 'rgba(179,181,198,1)',
                    pointBackgroundColor: 'rgba(179,181,198,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(179,181,198,1)',
                    data: [65, 59, 90, 81, 68, 75]
                }
            ]
        };
        this.data2 = {
            labels: ['Organización 1', 'Organización 2', 'Organización 3'],
            datasets: [
                {
                    label: 'Datasets',
                    backgroundColor: '#42A5F5',
                    borderColor: '#1E88E5',
                    data: [65, 59, 70]
                }
            ]
        };
        this.data3 = {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [
                {
                    label: 'Organización 1',
                    data: [97, 65, 23, 81, 56, 23, 0, 0, 0, 0, 0, 0],
                    fill: false,
                    borderColor: '#b34c37'
                },
                {
                    label: 'Organización 2',
                    data: [70, 45, 34, 70, 88, 12, 0, 0, 0, 0, 0, 0],
                    fill: false,
                    borderColor: '#4bc0c0'
                },
                {
                    label: 'Organización 3',
                    data: [65, 59, 80, 45, 56, 43, 0, 0, 0, 0, 0, 0],
                    fill: false,
                    borderColor: '#12d48a'
                }
            ]
        };
    }
    DataCenterHomeComponent.prototype.ngOnInit = function () {
    };
    return DataCenterHomeComponent;
}());
DataCenterHomeComponent = __decorate([
    core_1.Component({
        selector: 'app-data-center-home',
        templateUrl: './data-center-home.component.html',
        styleUrls: ['./data-center-home.component.css']
    }),
    __metadata("design:paramtypes", [])
], DataCenterHomeComponent);
exports.DataCenterHomeComponent = DataCenterHomeComponent;
//# sourceMappingURL=data-center-home.component.js.map