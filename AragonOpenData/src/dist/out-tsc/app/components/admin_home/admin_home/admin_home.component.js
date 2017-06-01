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
var AdminHomeComponent = (function () {
    function AdminHomeComponent() {
        this.data = {
            labels: ['Organización 1', 'Organización 2', 'Organización 3'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }
            ]
        };
        this.data2 = {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [
                {
                    label: '2017',
                    data: [65, 59, 80, 81, 56, 0, 0, 0, 0, 0, 0, 0],
                    fill: false,
                    borderColor: '#4bc0c0'
                }
            ]
        };
        this.data3 = {
            labels: ['Curso', 'Debate', 'Entrevista'],
            datasets: [
                {
                    label: 'Tipos',
                    backgroundColor: '#42A5F5',
                    borderColor: '#1E88E5',
                    data: [65, 59, 80]
                }
            ]
        };
    }
    AdminHomeComponent.prototype.ngOnInit = function () {
    };
    return AdminHomeComponent;
}());
AdminHomeComponent = __decorate([
    core_1.Component({
        selector: 'app-adminhome',
        templateUrl: './admin_home.component.html',
        styleUrls: ['./admin_home.component.css']
    }),
    __metadata("design:paramtypes", [])
], AdminHomeComponent);
exports.AdminHomeComponent = AdminHomeComponent;
//# sourceMappingURL=admin_home.component.js.map