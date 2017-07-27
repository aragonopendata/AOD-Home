import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminHomeComponent } from './components/app-admin/admin_home/admin_home.component';
import { DataCenterComponent } from './components/app-admin/data-center/data-center.component';
import { CampusComponent } from './components/app-admin/campus/admin_campus.component';
import { LoginComponent } from './components/login/login.component';
import { AppAdminComponent } from './components/app-admin/app-admin.component';
import { GlobalAdminComponent } from './components/app-admin/global-admin/global-admin.component';
import { DataCenterHomeComponent } from './components/app-admin/data-center/data-center-home/data-center-home.component';
import { DatasetsComponent } from './components/app-admin/data-center/datasets/datasets.component';
import { OrgsComponent } from './components/app-admin/data-center/orgs/orgs.component';
import { GlobalAdminHomeComponent } from './components/app-admin/global-admin/global-admin-home/global-admin-home.component';
import { UsersComponent } from './components/app-admin/global-admin/users/users.component';
import { RolesComponent } from './components/app-admin/global-admin/roles/roles.component';
import { InfoComponent } from './components/app-admin/global-admin/content/info/info.component';
import { ApplicationsComponent } from './components/app-admin/global-admin/content/applications/applications.component';
import { EventsComponent } from './components/app-admin/global-admin/content/events/events.component';
import { DevelopersComponent } from './components/app-admin/global-admin/content/developers/developers.component';
import { ApisComponent } from './components/app-admin/global-admin/content/apis/apis.component';
import { SparqlComponent } from './components/app-admin/global-admin/content/sparql/sparql.component';
import { ShowDatasetComponent } from './components/app-admin/data-center/datasets/show-dataset/show-dataset.component';
import { EditDatasetComponent } from './components/app-admin/data-center/datasets/edit-dataset/edit-dataset.component';
import { ListDatasetComponent } from './components/app-admin/data-center/datasets/list-dataset/list-dataset.component';
import { ContentComponent } from './components/app-admin/global-admin/content/content.component';
import { AppHomeComponent } from './components/app-home/app-home.component';
import { GlobalHomeComponent } from './components/app-home/global-home/global-home.component';
import { DataComponent } from './components/app-home/data/data.component';
import { TopicComponent } from './components/app-home/topic/topic.component';
import { OrganismComponent } from './components/app-home/organism/organism.component';
import { InformationComponent } from './components/app-home/static-content/information/information.component';
import { AppsComponent } from './components/app-home/static-content/apps/apps.component';
import { InfoEventsComponent } from './components/app-home/static-content/info-events/info-events.component';
import { CooperateComponent } from './components/app-home/static-content/cooperate/cooperate.component';
import { InfoDevelopersComponent } from './components/app-home/static-content/info-developers/info-developers.component';
import { InfoSparqlComponent } from './components/app-home/static-content/info-sparql/info-sparql.component';
import { InfoApisComponent } from './components/app-home/static-content/info-apis/info-apis.component';
import { OrgDetailComponent } from './components/app-home/organism/org-detail/org-detail.component';
import { PageNotFoundComponent } from './components/exceptions/page-not-found/page-not-found.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: AppHomeComponent, children: [
        { path: '', redirectTo: 'globalhome', pathMatch: 'full' },
        { path: 'globalhome', component: GlobalHomeComponent },
        { path: 'data', component: DataComponent },
        { path: 'topic', component: TopicComponent },
        { path: 'org', component: OrganismComponent },
        { path: 'org/:orgName', component: OrgDetailComponent },
        { path: 'inf', component: InformationComponent },
        { path: 'app', component: AppsComponent },
        { path: 'infoevents', component: InfoEventsComponent },
        { path: 'cooperate', component: CooperateComponent },
        { path: 'infodevelopers', component: InfoDevelopersComponent },
        { path: 'infoapis', component: InfoApisComponent },
        { path: 'infosparql', component: InfoSparqlComponent },
    ]},
    { path: 'appadmin', component: AppAdminComponent, children: [
        { path: '', redirectTo: 'globaladmin', pathMatch: 'full' },
        { path: 'globaladmin', component: GlobalAdminComponent, children: [
            { path: '', redirectTo: 'globaladminhome', pathMatch: 'full' },
            { path: 'globaladminhome', component: GlobalAdminHomeComponent },
            { path: 'users', component: UsersComponent },
            { path: 'roles', component: RolesComponent },
            { path: 'info', component: ContentComponent },
            { path: 'apps', component: ContentComponent },
            { path: 'events', component: ContentComponent },
            { path: 'developers', component: ContentComponent },
            { path: 'apis', component: ContentComponent },
            { path: 'sparql', component: ContentComponent },
        ]},
        { path: 'datacenter', component: DataCenterComponent, children: [
            { path: '', redirectTo: 'datacenterhome', pathMatch: 'full' },
            { path: 'datacenterhome', component: DataCenterHomeComponent },
            { path: 'datasets', component: DatasetsComponent, children: [
                { path: '', redirectTo: 'datasetlist', pathMatch: 'full' },
                { path: 'datasetlist', component: ListDatasetComponent },
                { path: 'showdataset', component: ShowDatasetComponent },
                { path: 'editdataset', component: EditDatasetComponent }
            ]},
            { path: 'orgs', component: OrgsComponent },
        ]},
        { path: 'campus', component: CampusComponent }
    ]},
    { path: 'login', component: LoginComponent },
    { path: 'pagenotfound', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/pagenotfound' },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
    providers: []
})
export class AppRoutingModule {}
