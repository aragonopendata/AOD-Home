import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/web/home.component';
import { DatasetsListComponent } from './components/web/datasets/datasets-list/datasets-list.component';
import { DatasetsDetailComponent } from './components/web/datasets/datasets-detail/datasets-detail.component';
import { TopicsListComponent } from './components/web/topics/topics-list/topics-list.component';
import { OrganizationsListComponent } from './components/web/organizations/organizations-list/organizations-list.component';
import { OrganizationsDetailComponent } from './components/web/organizations/organizations-detail/organizations-detail.component';
import { OpenDataComponent } from './components/web/static-content/info/open-data/open-data.component';
import { ApplicationsComponent } from './components/web/static-content/info/applications/applications.component';
import { EventsComponent } from './components/web/static-content/info/events/events.component';
import { CollaborationComponent } from './components/web/static-content/info/collaboration/collaboration.component';
import { CampusComponent } from './components/web/static-content/tools/campus/campus.component';
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
import { CampusAdminComponent } from './components/admin/campus-admin/campus-admin.component';
import { PageNotFoundComponent } from './components/error/page-not-found/page-not-found.component';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'datos', redirectTo: 'datos/catalogo', pathMatch: 'full' },
    { path: 'datos/catalogo', component: DatasetsListComponent, pathMatch: 'full' },
    { path: 'datos/catalogo/dataset/:datasetName', component: DatasetsDetailComponent, pathMatch: 'full' },
    { path: 'datos/catalogo/temas/:topicName', component: DatasetsListComponent, pathMatch: 'full' },
    { path: 'datos/catalogo/publicadores/:organizationName', component: DatasetsListComponent, pathMatch: 'full' },
    { path: 'datos/catalogo/etiquetas', component: DatasetsListComponent, pathMatch: 'full' },
    { path: 'datos/temas', component: TopicsListComponent, pathMatch: 'full' },
    { path: 'datos/publicadores', component: OrganizationsListComponent, pathMatch: 'full' },
    { path: 'datos/publicadores/:organizationName', component: OrganizationsDetailComponent, pathMatch: 'full' },
    { path: 'info', redirectTo: 'info/open-data', pathMatch: 'full' },
    { path: 'info/open-data', component: OpenDataComponent, pathMatch: 'full' },
    { path: 'info/aplicaciones', component: ApplicationsComponent, pathMatch: 'full' },
    { path: 'info/eventos', component: EventsComponent, pathMatch: 'full' },
    { path: 'info/colabora', component: CollaborationComponent, pathMatch: 'full' },
    { path: 'herramientas', redirectTo: 'herramientas/desarrolladores', pathMatch: 'full' },
    { path: 'herramientas/desarrolladores', component: DevelopersComponent, pathMatch: 'full' },
    { path: 'herramientas/campus', component: CampusComponent, pathMatch: 'full' },
    { path: 'herramientas/desarrolladores', component: DevelopersComponent, pathMatch: 'full' },
    { path: 'herramientas/apis', component: ApisComponent, pathMatch: 'full' },
    { path: 'herramientas/sparql', component: SparqlComponent, pathMatch: 'full' },
    { path: 'herramientas/sparql/client', component: SparqlClientComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'login/forgot-password', component: ForgottenPasswordComponent, pathMatch: 'full' },
    { path: 'login/restore-password', component: RestorePasswordComponent, pathMatch: 'full' },
    { path: 'admin', component: HomeAdminComponent, children: [
        { path: '',redirectTo: 'global', pathMatch: 'full' },
        { path: 'global', component: GlobalComponent, children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardGlobalComponent, pathMatch: 'full' },
            { path: 'users', component: UsersAdminComponent, pathMatch: 'full' },
            { path: 'roles', component: RolesAdminComponent, pathMatch: 'full' },
            { path: 'content', children: [
                { path: 'info', component: OpenDataAdminComponent, pathMatch: 'full' },
                { path: 'apps', component: ApplicationsAdminComponent, pathMatch: 'full' },
                { path: 'events', component: EventsAdminComponent, pathMatch: 'full' },
                { path: 'collaboration', component: CollaborationAdminComponent, pathMatch: 'full' },
                { path: 'developers', component: DevelopersAdminComponent, pathMatch: 'full' },
                { path: 'apis', component: ApisAdminComponent, pathMatch: 'full' },
                { path: 'sparql', component: SparqlAdminComponent, pathMatch: 'full' }
            ]},
        ]},
        { path: 'datacenter', component: DatacenterComponent, children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardDatacenterComponent, pathMatch: 'full' },
            { path: 'datasets', component: DatasetsAdminComponent, children: [
                { path: '', redirectTo: 'list', pathMatch: 'full' },
                { path: 'list', component: DatasetsAdminListComponent, pathMatch: 'full' },
                { path: 'show', component: DatasetsAdminShowComponent, pathMatch: 'full' },
                { path: 'edit', component: DatasetsAdminEditComponent, pathMatch: 'full' }
            ]},
            { path: 'organizations', component: OrganizationsAdminComponent, pathMatch: 'full' }
        ]},
        { path: 'campus', component: CampusAdminComponent, pathMatch: 'full' }
    ]},
    { path: 'pagenotfound', component: PageNotFoundComponent, pathMatch: 'full' },
    { path: '**', redirectTo: '/pagenotfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }