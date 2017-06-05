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
var User_1 = require("../../../../models/User");
var UsersComponent = (function () {
    function UsersComponent() {
        this.users = [
            new User_1.User("username01", "Administrador total", new Date, true),
            new User_1.User("username02", "Administrador", new Date, false)
        ];
    }
    UsersComponent.prototype.ngOnInit = function () {
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        };
    };
    UsersComponent.prototype.showDialogToAdd = function () {
        this.user = new User_1.User("", "", null, false);
        this.displayDialog = true;
    };
    UsersComponent.prototype.showDialog = function (user, disabled) {
        this.user = this.cloneUser(user);
        this.displayDialog = true;
        this.disabled = disabled;
    };
    UsersComponent.prototype.cloneUser = function (u) {
        var user = new User_1.User("", "", null, false);
        for (var prop in u) {
            user[prop] = u[prop];
        }
        return user;
    };
    UsersComponent.prototype.save = function () {
        var users = this.users.slice();
        users.push(this.user);
        this.users = users;
        this.user = null;
        this.displayDialog = false;
    };
    UsersComponent.prototype.enableEdition = function () {
        this.disabled = !this.disabled;
        console.log(this.disabled);
    };
    return UsersComponent;
}());
UsersComponent = __decorate([
    core_1.Component({
        selector: 'app-users',
        templateUrl: './users.component.html',
        styleUrls: ['./users.component.css']
    }),
    __metadata("design:paramtypes", [])
], UsersComponent);
exports.UsersComponent = UsersComponent;
//# sourceMappingURL=users.component.js.map