"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var home_component_1 = require("./components/home/home.component");
var admin_home_component_1 = require("./components/app-admin/admin_home/admin_home.component");
var data_center_component_1 = require("./components/app-admin/data-center/data-center.component");
var admin_campus_component_1 = require("./components/app-admin/campus/admin_campus.component");
var login_component_1 = require("./components/login/login.component");
var app_admin_component_1 = require("./components/app-admin/app-admin.component");
var global_admin_component_1 = require("./components/app-admin/global-admin/global-admin.component");
var data_center_home_component_1 = require("./components/app-admin/data-center/data-center-home/data-center-home.component");
var datasets_component_1 = require("./components/app-admin/data-center/datasets/datasets.component");
var orgs_component_1 = require("./components/app-admin/data-center/orgs/orgs.component");
var global_admin_home_component_1 = require("./components/app-admin/global-admin/global-admin-home/global-admin-home.component");
var users_component_1 = require("./components/app-admin/global-admin/users/users.component");
var roles_component_1 = require("./components/app-admin/global-admin/roles/roles.component");
var content_component_1 = require("./components/app-admin/global-admin/content/content.component");
var routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: home_component_1.HomeComponent },
    { path: 'appadmin', component: app_admin_component_1.AppAdminComponent, children: [
            { path: '', redirectTo: 'adminhome', pathMatch: 'full' },
            { path: 'adminhome', component: admin_home_component_1.AdminHomeComponent },
            { path: 'globaladmin', component: global_admin_component_1.GlobalAdminComponent, children: [
                    { path: '', redirectTo: 'globaladminhome', pathMatch: 'full' },
                    { path: 'globaladminhome', component: global_admin_home_component_1.GlobalAdminHomeComponent },
                    { path: 'users', component: users_component_1.UsersComponent },
                    { path: 'roles', component: roles_component_1.RolesComponent },
                    { path: 'info', component: content_component_1.ContentComponent },
                    { path: 'apps', component: content_component_1.ContentComponent },
                    { path: 'events', component: content_component_1.ContentComponent },
                    { path: 'developers', component: content_component_1.ContentComponent },
                    { path: 'apis', component: content_component_1.ContentComponent },
                    { path: 'sparql', component: content_component_1.ContentComponent },
                ] },
            { path: 'datacenter', component: data_center_component_1.DataCenterComponent, children: [
                    { path: '', redirectTo: 'datacenterhome', pathMatch: 'full' },
                    { path: 'datacenterhome', component: data_center_home_component_1.DataCenterHomeComponent },
                    { path: 'datasets', component: datasets_component_1.DatasetsComponent },
                    { path: 'orgs', component: orgs_component_1.OrgsComponent },
                ] },
            { path: 'campus', component: admin_campus_component_1.CampusComponent }
        ] },
    { path: 'login', component: login_component_1.LoginComponent },
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule],
        providers: []
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map