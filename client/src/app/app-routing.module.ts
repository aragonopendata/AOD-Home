import { NgModule } from '@angular/core';
import { CommonModule, PathLocationStrategy, LocationStrategy } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Constants } from './app.constants';
import { AuthGuard } from "./_guards/auth.guard";

import { HomeComponent } from './components/web/home.component';
import { DatasetsListComponent } from './components/web/datasets/datasets-list/datasets-list.component';
import { DatasetsDetailComponent } from './components/web/datasets/datasets-detail/datasets-detail.component';
import { TopicsListComponent } from './components/web/topics/topics-list/topics-list.component';
import { OrganizationsListComponent } from './components/web/organizations/organizations-list/organizations-list.component';
import { OrganizationsDetailComponent } from './components/web/organizations/organizations-detail/organizations-detail.component';
import { OpenDataComponent } from './components/web/static-content/info/open-data/open-data.component';
import { TermsComponent } from './components/web/static-content/info/terms/terms.component';
import { ApplicationsComponent } from './components/web/static-content/info/applications/applications.component';
import { EventsComponent } from './components/web/static-content/info/events/events.component';
import { CollaborationComponent } from './components/web/static-content/info/collaboration/collaboration.component';
import { AnalyticsComponent } from './components/web/static-content/services/analytics/analytics.component';
import { CampusComponent } from './components/web/static-content/tools/campus/campus.component';
import { CampusDetailComponent } from './components/web/static-content/tools/campus/campus-detail/campus-detail.component';
import { DevelopersComponent } from './components/web/static-content/tools/developers/developers.component';
import { ApisComponent } from './components/web/static-content/tools/apis/apis.component';
import { SparqlComponent } from './components/web/static-content/tools/sparql/sparql.component';
import { SparqlClientComponent } from './components/web/static-content/tools/sparql/sparql-client/sparql-client.component';
import { LoginComponent } from './components/login/login.component';
import { ForgottenPasswordComponent } from './components/login/forgotten-password/forgotten-password.component';
import { RestorePasswordComponent } from './components/login/restore-password/restore-password.component';
import { HomeAdminComponent } from './components/admin/home-admin.component';
import { GlobalComponent } from './components/admin/global/global.component';
import { DashboardGlobalComponent } from './components/admin/global/dashboard-global/dashboard-global.component';
import { UsersAdminComponent } from './components/admin/global/users-admin/users-admin.component';
import { RolesAdminComponent } from './components/admin/global/roles-admin/roles-admin.component';
import { ApplicationsAdminComponent } from './components/admin/global/static-content-admin/info/applications-admin/applications-admin.component';
import { CollaborationAdminComponent } from './components/admin/global/static-content-admin/info/collaboration-admin/collaboration-admin.component';
import { EventsAdminComponent } from './components/admin/global/static-content-admin/info/events-admin/events-admin.component';
import { OpenDataAdminComponent } from './components/admin/global/static-content-admin/info/open-data-admin/open-data-admin.component';
import { ApisAdminComponent } from './components/admin/global/static-content-admin/tools/apis-admin/apis-admin.component';
import { DevelopersAdminComponent } from './components/admin/global/static-content-admin/tools/developers-admin/developers-admin.component';
import { SparqlAdminComponent } from './components/admin/global/static-content-admin/tools/sparql-admin/sparql-admin.component';
import { DatacenterComponent } from './components/admin/datacenter/datacenter.component';
import { DashboardDatacenterComponent } from './components/admin/datacenter/dashboard-datacenter/dashboard-datacenter.component';
import { DatasetsAdminComponent } from './components/admin/datacenter/datasets-admin/datasets-admin.component';
import { DatasetsAdminShowComponent } from './components/admin/datacenter/datasets-admin/datasets-admin-show/datasets-admin-show.component';
import { DatasetsAdminEditComponent } from './components/admin/datacenter/datasets-admin/datasets-admin-edit/datasets-admin-edit.component';
import { DatasetsAdminListComponent } from './components/admin/datacenter/datasets-admin/datasets-admin-list/datasets-admin-list.component';
import { OrganizationsAdminComponent } from './components/admin/datacenter/organizations-admin/organizations-admin.component';
import { OrganizationsAdminListComponent } from './components/admin/datacenter/organizations-admin/organizations-admin-list/organizations-admin-list.component';
import { OrganizationsAdminShowComponent } from './components/admin/datacenter/organizations-admin/organizations-admin-show/organizations-admin-show.component';
import { OrganizationsAdminEditComponent } from './components/admin/datacenter/organizations-admin/organizations-admin-edit/organizations-admin-edit.component';
import { CampusAdminComponent } from './components/admin/campus-admin/campus-admin.component';
import { LogstashComponent } from './components/admin/logstash/logstash.component';
import { PageNotFoundComponent } from './components/error/page-not-found/page-not-found.component';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: Constants.ROUTER_LINK_DATA, redirectTo: Constants.ROUTER_LINK_DATA_CATALOG },
    { path: Constants.ROUTER_LINK_DATA_CATALOG, component: DatasetsListComponent },
    { path: Constants.ROUTER_LINK_DATA_CATALOG_DATASET + '/:' + Constants.ROUTER_LINK_DATA_PARAM_DATASET_NAME, component: DatasetsDetailComponent },
    { path: Constants.ROUTER_LINK_DATA_CATALOG_TOPICS + '/:' + Constants.ROUTER_LINK_DATA_PARAM_TOPIC_NAME, component: DatasetsListComponent },
    { path: Constants.ROUTER_LINK_DATA_CATALOG_ORGANIZATIONS + '/:' + Constants.ROUTER_LINK_DATA_PARAM_ORGANIZATION_NAME, component: OrganizationsDetailComponent },
    { path: Constants.ROUTER_LINK_DATA_CATALOG_TAGS, component: DatasetsListComponent },
    { path: Constants.ROUTER_LINK_DATA_CATALOG_STATS, component: DatasetsListComponent },
    { path: Constants.ROUTER_LINK_DATA_CATALOG_HOMER, component: DatasetsListComponent },
    { path: Constants.ROUTER_LINK_DATA_CATALOG_HOMER_DATASET, component: DatasetsDetailComponent }, 
    { path: Constants.ROUTER_LINK_DATA_CATALOG_HOMER_DATASET + '/:' + Constants.ROUTER_LINK_DATA_PARAM_DATASET_HOMER_NAME, component: DatasetsDetailComponent }, 
    { path: Constants.ROUTER_LINK_DATA_TOPICS, component: TopicsListComponent },
    { path: Constants.ROUTER_LINK_DATA_ORGANIZATIONS, component: OrganizationsListComponent },
    { path: Constants.ROUTER_LINK_INFORMATION, redirectTo: Constants.ROUTER_LINK_INFORMATION_OPEN_DATA },
    { path: Constants.ROUTER_LINK_INFORMATION_OPEN_DATA, component: OpenDataComponent },
    { path: Constants.ROUTER_LINK_INFORMATION_TERMS, component: TermsComponent },
    { path: Constants.ROUTER_LINK_INFORMATION_APPS, component: ApplicationsComponent },
    { path: Constants.ROUTER_LINK_INFORMATION_EVENTS, component: EventsComponent },
    { path: Constants.ROUTER_LINK_INFORMATION_COLLABORATION, component: CollaborationComponent },
    { path: Constants.ROUTER_LINK_SERVICES_ANALYTICS, component: AnalyticsComponent },
    { path: Constants.ROUTER_LINK_TOOLS, redirectTo: Constants.ROUTER_LINK_TOOLS_DEVELOPERS },
    { path: Constants.ROUTER_LINK_TOOLS_DEVELOPERS, component: DevelopersComponent },
    { path: Constants.ROUTER_LINK_TOOLS_CAMPUS, component: CampusComponent },
    { path: Constants.ROUTER_LINK_TOOLS_CAMPUS_CONTENT + '/:' + Constants.ROUTER_LINK_TOOLS_CAMPUS_EVENT_NAME, component: CampusDetailComponent },
    { path: Constants.ROUTER_LINK_TOOLS_APIS, component: ApisComponent },
    { path: Constants.ROUTER_LINK_TOOLS_SPARQL, component: SparqlComponent },
    // { path: Constants.ROUTER_LINK_TOOLS_SPARQL_CLIENT, component: SparqlClientComponent, pathMatch: 'full' },
    { path: Constants.ROUTER_LINK_LOGIN, component: LoginComponent },
    { path: Constants.ROUTER_LINK_LOGIN + '/:' + Constants.ROUTER_LINK_DATA_PARAM_DATA_LOGIN + '/:' + Constants.ROUTER_LINK_DATA_PARAM_EDIT_DATA, component: LoginComponent },
    { path: Constants.ROUTER_LINK_LOGIN_FORGOT_PASSWORD, component: ForgottenPasswordComponent },
    { path: Constants.ROUTER_LINK_LOGIN_FORGOT_PASSWORD, component: RestorePasswordComponent },
    { path: Constants.ROUTER_LINK_ADMIN, component: HomeAdminComponent, canActivate: [AuthGuard], children: [
        { path: '',redirectTo: Constants.ROUTER_LINK_GLOBAL, pathMatch: 'full' },
        { path: Constants.ROUTER_LINK_GLOBAL, component: GlobalComponent, canActivate: [AuthGuard], children: [
            { path: '', redirectTo: Constants.ROUTER_LINK_DASHBOARD, pathMatch: 'full' },
            { path: Constants.ROUTER_LINK_DASHBOARD, component: DashboardGlobalComponent, canActivate: [AuthGuard] },
            { path: Constants.ROUTER_LINK_USERS, component: UsersAdminComponent, canActivate: [AuthGuard] },
            { path: Constants.ROUTER_LINK_ROLES, component: RolesAdminComponent, canActivate: [AuthGuard] },
            { path: Constants.ROUTER_LINK_CONTENT, canActivate: [AuthGuard], children: [
                { path: Constants.ROUTER_LINK_INFO, component: OpenDataAdminComponent, canActivate: [AuthGuard] },
                { path: Constants.ROUTER_LINK_APPS, component: ApplicationsAdminComponent, canActivate: [AuthGuard] },
                { path: Constants.ROUTER_LINK_EVENTS, component: EventsAdminComponent, canActivate: [AuthGuard] },
                { path: Constants.ROUTER_LINK_COLLABORATION, component: CollaborationAdminComponent, canActivate: [AuthGuard] },
                { path: Constants.ROUTER_LINK_DEVELOPERS, component: DevelopersAdminComponent, canActivate: [AuthGuard] },
                { path: Constants.ROUTER_LINK_APIS, component: ApisAdminComponent, canActivate: [AuthGuard] },
                { path: Constants.ROUTER_LINK_SPARQL, component: SparqlAdminComponent, canActivate: [AuthGuard] }
            ]},
        ]},
        { path: Constants.ROUTER_LINK_DATACENTER, component: DatacenterComponent, canActivate: [AuthGuard], children: [
            { path: '', redirectTo: Constants.ROUTER_LINK_DASHBOARD, pathMatch: 'full' },
            { path: Constants.ROUTER_LINK_DASHBOARD, component: DashboardDatacenterComponent, canActivate: [AuthGuard] },
            { path: Constants.ROUTER_LINK_DATASETS, component: DatasetsAdminComponent, canActivate: [AuthGuard], children: [
                { path: '', redirectTo: Constants.ROUTER_LINK_DATASETS_LIST, canActivate: [AuthGuard], pathMatch: 'full' },
                { path: Constants.ROUTER_LINK_DATASETS_LIST, component: DatasetsAdminListComponent, canActivate: [AuthGuard] },
                { path: Constants.ROUTER_LINK_DATASETS_SHOW + '/:' + Constants.ROUTER_LINK_DATA_PARAM_DATASET_NAME, component: DatasetsAdminShowComponent, canActivate: [AuthGuard] },
                { path: Constants.ROUTER_LINK_DATASETS_EDIT, component: DatasetsAdminEditComponent, canActivate: [AuthGuard] },
                { path: Constants.ROUTER_LINK_DATASETS_EDIT + '/:' + Constants.ROUTER_LINK_DATA_PARAM_DATASET_NAME, component: DatasetsAdminEditComponent, canActivate: [AuthGuard] }
            ]},
            { path: Constants.ROUTER_LINK_ORGANIZATIONS, component: OrganizationsAdminComponent, canActivate: [AuthGuard], children:[
                { path: '', redirectTo: Constants.ROUTER_LINK_ORGANIZATIONS_LIST, canActivate: [AuthGuard], pathMatch: 'full' },
                { path: Constants.ROUTER_LINK_ORGANIZATIONS_LIST, component: OrganizationsAdminListComponent, canActivate: [AuthGuard] },
                { path: Constants.ROUTER_LINK_ORGANIZATIONS_SHOW + '/:' + Constants.ROUTER_LINK_DATA_PARAM_ORGANIZATION_NAME, component: OrganizationsAdminShowComponent, canActivate: [AuthGuard] },
                { path: Constants.ROUTER_LINK_ORGANIZATIONS_EDIT, component: OrganizationsAdminEditComponent, canActivate: [AuthGuard] },
                { path: Constants.ROUTER_LINK_ORGANIZATIONS_EDIT + '/:' + Constants.ROUTER_LINK_DATA_PARAM_ORGANIZATION_NAME, component: OrganizationsAdminEditComponent, canActivate: [AuthGuard] }
            ]}
        ]},
        { path: Constants.ROUTER_LINK_CAMPUS, component: CampusAdminComponent, canActivate: [AuthGuard] },
        { path: Constants.ROUTER_LINK_LOGSTASH, component: LogstashComponent, canActivate: [AuthGuard] }
    ]},
    //{ path: Constants.ROUTER_LINK_404, component: PageNotFoundComponent },
    { path: '**', redirectTo: '/'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class AppRoutingModule { }