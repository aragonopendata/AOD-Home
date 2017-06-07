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
var Role_1 = require("../../../../models/Role");
var User_1 = require("../../../../models/User");
var RolesComponent = (function () {
    function RolesComponent() {
        this.displayUsers = false;
        this.users = [];
        this.roles = [];
        this.role = new Role_1.Role("", "", null);
        this.users = [
            new User_1.User("username01", "Administrador total", new Date, true),
            new User_1.User("username02", "Administrador total", new Date, false),
            new User_1.User("username03", "Administrador de organizacion", new Date, true),
            new User_1.User("username04", "Administrador de organización", new Date, false),
            new User_1.User("username05", "Watcher", new Date, true),
            new User_1.User("username06", "Watcher", new Date, false)
        ];
        this.roles = [
            new Role_1.Role("Administrador total", "Puede editar todo en el portal.", this.users),
            new Role_1.Role("Administrador de organizacion", "Puede editar sólo datos de su organización.", this.users),
            new Role_1.Role("Watcher", "Puede visualizar datos privados, pero no editarlos", this.users)
        ];
    }
    RolesComponent.prototype.ngOnInit = function () {
    };
    RolesComponent.prototype.showUsers = function (role) {
        this.role = role;
        console.log(this.role.assignedUsers);
        this.displayUsers = true;
    };
    RolesComponent.prototype.showDialogToAdd = function () {
        this.role = new Role_1.Role("", "", null);
        this.displayDialogEdit = true;
    };
    RolesComponent.prototype.showDialog = function (role, edit) {
        this.role = this.cloneRole(role);
        if (edit) {
            this.displayDialogEdit = true;
        }
        else {
            this.displayDialog = true;
        }
    };
    RolesComponent.prototype.cloneRole = function (r) {
        var role = new Role_1.Role("", "", null);
        for (var prop in r) {
            role[prop] = r[prop];
        }
        return role;
    };
    RolesComponent.prototype.enableEdition = function () {
        this.displayDialog = !this.displayDialog;
        this.displayDialogEdit = !this.displayDialogEdit;
    };
    return RolesComponent;
}());
RolesComponent = __decorate([
    core_1.Component({
        selector: 'app-roles',
        templateUrl: './roles.component.html',
        styleUrls: ['./roles.component.css']
    }),
    __metadata("design:paramtypes", [])
], RolesComponent);
exports.RolesComponent = RolesComponent;
//# sourceMappingURL=roles.component.js.map