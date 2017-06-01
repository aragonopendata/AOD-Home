"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_routing_module_1 = require("./app-routing.module");
var animations_1 = require("@angular/platform-browser/animations");
var primeng_1 = require("primeng/primeng");
var app_component_1 = require("./app.component");
var home_component_1 = require("./components/home/home.component");
var admin_home_component_1 = require("./components/app-admin/admin_home/admin_home.component");
var data_center_component_1 = require("./components/app-admin/data-center/data-center.component");
var admin_campus_component_1 = require("./components/app-admin/campus/admin_campus.component");
var login_component_1 = require("./components/login/login.component");
var app_admin_component_1 = require("./components/app-admin/app-admin.component");
var global_admin_component_1 = require("./components/app-admin/global-admin/global-admin.component");
var users_component_1 = require("./components/app-admin/global-admin/users/users.component");
var roles_component_1 = require("./components/app-admin/global-admin/roles/roles.component");
var content_component_1 = require("./components/app-admin/global-admin/content/content.component");
var datasets_component_1 = require("./components/app-admin/data-center/datasets/datasets.component");
var orgs_component_1 = require("./components/app-admin/data-center/orgs/orgs.component");
var info_component_1 = require("./components/app-admin/global-admin/content/info/info.component");
var applications_component_1 = require("./components/app-admin/global-admin/content/applications/applications.component");
var events_component_1 = require("./components/app-admin/global-admin/content/events/events.component");
var developers_component_1 = require("./components/app-admin/global-admin/content/developers/developers.component");
var apis_component_1 = require("./components/app-admin/global-admin/content/apis/apis.component");
var sparql_component_1 = require("./components/app-admin/global-admin/content/sparql/sparql.component");
var data_center_home_component_1 = require("./components/app-admin/data-center/data-center-home/data-center-home.component");
var global_admin_home_component_1 = require("./components/app-admin/global-admin/global-admin-home/global-admin-home.component");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            home_component_1.HomeComponent,
            admin_home_component_1.AdminHomeComponent,
            data_center_component_1.DataCenterComponent,
            admin_campus_component_1.CampusComponent,
            login_component_1.LoginComponent,
            app_admin_component_1.AppAdminComponent,
            global_admin_component_1.GlobalAdminComponent,
            users_component_1.UsersComponent,
            roles_component_1.RolesComponent,
            content_component_1.ContentComponent,
            datasets_component_1.DatasetsComponent,
            orgs_component_1.OrgsComponent,
            info_component_1.InfoComponent,
            applications_component_1.ApplicationsComponent,
            events_component_1.EventsComponent,
            developers_component_1.DevelopersComponent,
            apis_component_1.ApisComponent,
            sparql_component_1.SparqlComponent,
            data_center_home_component_1.DataCenterHomeComponent,
            global_admin_home_component_1.GlobalAdminHomeComponent
        ],
        imports: [
            platform_browser_1.BrowserModule,
            animations_1.BrowserAnimationsModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            app_routing_module_1.AppRoutingModule,
            primeng_1.ChartModule,
            primeng_1.PanelModule,
            primeng_1.FieldsetModule,
            primeng_1.InputTextModule,
            primeng_1.DropdownModule,
            primeng_1.InputTextareaModule,
            primeng_1.ButtonModule,
            primeng_1.DataTableModule,
            primeng_1.SharedModule
        ],
        providers: [],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map