import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AdminHomeComponent } from './components/app-admin/admin_home/admin_home.component';
import {DataCenterComponent} from './components/app-admin/data-center/data-center.component';
import {CampusComponent} from './components/app-admin/campus/admin_campus.component';
import {LoginComponent} from './components/login/login.component';
import {AppAdminComponent} from './components/app-admin/app-admin.component';
import {GlobalAdminComponent} from './components/app-admin/global-admin/global-admin.component';
import {DataCenterHomeComponent} from './components/app-admin/data-center/data-center-home/data-center-home.component';
import {DatasetsComponent} from './components/app-admin/data-center/datasets/datasets.component';
import {OrgsComponent} from './components/app-admin/data-center/orgs/orgs.component';
import {GlobalAdminHomeComponent} from './components/app-admin/global-admin/global-admin-home/global-admin-home.component';
import {UsersComponent} from './components/app-admin/global-admin/users/users.component';
import {RolesComponent} from './components/app-admin/global-admin/roles/roles.component';
import {ContentComponent} from './components/app-admin/global-admin/content/content.component';
import {InfoComponent} from './components/app-admin/global-admin/content/info/info.component';
import {ApplicationsComponent} from './components/app-admin/global-admin/content/applications/applications.component';
import {EventsComponent} from './components/app-admin/global-admin/content/events/events.component';
import {DevelopersComponent} from './components/app-admin/global-admin/content/developers/developers.component';
import {ApisComponent} from './components/app-admin/global-admin/content/apis/apis.component';
import {SparqlComponent} from './components/app-admin/global-admin/content/sparql/sparql.component';

const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'appadmin', component: AppAdminComponent, children: [
        {path: '', redirectTo: 'adminhome', pathMatch: 'full'},
        {path: 'adminhome', component: AdminHomeComponent},
        {path: 'globaladmin', component: GlobalAdminComponent, children: [
            {path: '', redirectTo: 'globaladminhome', pathMatch: 'full'},
            {path: 'globaladminhome', component: GlobalAdminHomeComponent},
            {path: 'users', component: UsersComponent},
            {path: 'roles', component: RolesComponent},
            {path: 'content', component: ContentComponent},
            {path: 'info', component: InfoComponent},
            {path: 'apps', component: ApplicationsComponent},
            {path: 'events', component: EventsComponent},
            {path: 'developers', component: DevelopersComponent},
            {path: 'apis', component: ApisComponent},
            {path: 'sparql', component: SparqlComponent},
        ]},
        {path: 'datacenter', component: DataCenterComponent, children: [
            { path: '', redirectTo: 'datacenterhome', pathMatch: 'full' },
            {path: 'datacenterhome', component: DataCenterHomeComponent},
            {path: 'datasets', component: DatasetsComponent},
            {path: 'orgs', component: OrgsComponent},
        ]},
        {path: 'campus', component: CampusComponent}
    ]},
    { path: 'login', component: LoginComponent},
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
    providers: []
})
export class AppRoutingModule {}
