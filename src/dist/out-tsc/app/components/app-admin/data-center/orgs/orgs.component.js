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
var Org_1 = require("../../../../models/Org");
var OrgsComponent = (function () {
    function OrgsComponent() {
        this.displayDialog = false;
        this.displayDialogEdit = false;
        this.orgs = [];
        this.orgs = [
            new Org_1.Org("Instituto de salud", "http://www.org1.es", "La Dirección General de Administración Electrónica y Sociedad de la Información es una de las tres que forman parte del Departamento de Innovación, Investigación y Universidades del Gobierno de Aragón. La Dirección General se divide en tres áreas de competencias que organizativamente encabezan tres Jefaturas de Servicio diferentes.", "Dirección 1", "Responsable 1", "Contacto 1"),
            new Org_1.Org("Organización 2", "http://www.org2.es", "Descripción 2", "Dirección 2", "Responsable 2", "Contacto 2"),
            new Org_1.Org("Instituto Educación Secundaria Pablo Serrano", "http://www.org2.es", "Descripción 2", "Dirección 2", "Responsable 2", "Contacto 2"),
            new Org_1.Org("Organización 2", "http://www.org2.es", "Descripción 2", "Dirección 2", "Responsable 2", "Contacto 2"),
            new Org_1.Org("Organización 2", "http://www.org2.es", "Descripción 2", "Dirección 2", "Responsable 2", "Contacto 2"),
            new Org_1.Org("Organización 2", "http://www.org2.es", "Descripción 2", "Dirección 2", "Responsable 2", "Contacto 2"),
            new Org_1.Org("Organización 2", "http://www.org2.es", "Descripción 2", "Dirección 2", "Responsable 2", "Contacto 2")
        ];
        this.results = this.orgs;
    }
    OrgsComponent.prototype.ngOnInit = function () { };
    OrgsComponent.prototype.selectOrg = function (org) {
        this.selectedOrg = org;
        this.displayDialog = true;
    };
    OrgsComponent.prototype.enableEdition = function () {
        this.displayDialogEdit = true;
        this.displayDialog = false;
    };
    OrgsComponent.prototype.search = function (event) {
        var query = event.query;
        console.log(query);
        if (query == "") {
            this.results = this.orgs;
        }
        else {
            this.results = [];
        }
        for (var i = 0; i < this.orgs.length; i++) {
            if (this.orgs[i].orgName.search(query) != -1) {
                this.selectedOrg = this.orgs[i];
                this.results.push(this.selectedOrg);
            }
        }
        console.log(this.results);
    };
    return OrgsComponent;
}());
OrgsComponent = __decorate([
    core_1.Component({
        selector: 'app-orgs',
        templateUrl: './orgs.component.html',
        styleUrls: ['./orgs.component.css']
    }),
    __metadata("design:paramtypes", [])
], OrgsComponent);
exports.OrgsComponent = OrgsComponent;
//# sourceMappingURL=orgs.component.js.map