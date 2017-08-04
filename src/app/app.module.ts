import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ChartModule, PanelModule, FieldsetModule, InputTextModule, DropdownModule,
  InputTextareaModule, ButtonModule, SharedModule, DataTableModule, DialogModule, CalendarModule, InputSwitchModule, EditorModule,
  DataListModule, TooltipModule, AutoCompleteModule, ProgressBarModule, RadioButtonModule, CheckboxModule, FileUploadModule, ToolbarModule, TabViewModule
} from 'primeng/primeng';
import {MdSidenavModule} from '@angular/material';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { AdminHomeComponent } from './components/app-admin/admin_home/admin_home.component';
import { DataCenterComponent } from './components/app-admin/data-center/data-center.component';
import {CampusComponent} from './components/app-admin/campus/admin_campus.component';
import { LoginComponent } from './components/login/login.component';
import { AppAdminComponent } from './components/app-admin/app-admin.component';
import { GlobalAdminComponent } from './components/app-admin/global-admin/global-admin.component';
import { UsersComponent } from './components/app-admin/global-admin/users/users.component';
import { RolesComponent } from './components/app-admin/global-admin/roles/roles.component';
import { ContentComponent } from './components/app-admin/global-admin/content/content.component';
import { DatasetsComponent } from './components/app-admin/data-center/datasets/datasets.component';
import { OrgsComponent } from './components/app-admin/data-center/orgs/orgs.component';
import { InfoComponent } from './components/app-admin/global-admin/content/info/info.component';
import { ApplicationsComponent } from './components/app-admin/global-admin/content/applications/applications.component';
import { EventsComponent } from './components/app-admin/global-admin/content/events/events.component';
import { DevelopersComponent } from './components/app-admin/global-admin/content/developers/developers.component';
import { ApisComponent } from './components/app-admin/global-admin/content/apis/apis.component';
import { SparqlComponent } from './components/app-admin/global-admin/content/sparql/sparql.component';
import { DataCenterHomeComponent } from './components/app-admin/data-center/data-center-home/data-center-home.component';
import { GlobalAdminHomeComponent } from './components/app-admin/global-admin/global-admin-home/global-admin-home.component';
import { ShowDatasetComponent } from './components/app-admin/data-center/datasets/show-dataset/show-dataset.component';
import { EditDatasetComponent } from './components/app-admin/data-center/datasets/edit-dataset/edit-dataset.component';
import { ListDatasetComponent } from './components/app-admin/data-center/datasets/list-dataset/list-dataset.component';
import {DatasetService} from './services/dataset/dataset.service';
import {TopicService} from './services/topic/topic.service';
import {PublicadorService} from './services/publicador/publicador.service';
import { AppHomeComponent } from './components/app-home/app-home.component';
import { GlobalHomeComponent } from './components/app-home/global-home/global-home.component';
import { DataComponent } from "./components/app-home/data/data.component";
import { TopicComponent } from './components/app-home/topic/topic.component';
import { OrganismComponent } from './components/app-home/organism/organism.component';
import { InformationComponent } from './components/app-home/static-content/information/information.component';
import { AppsComponent } from './components/app-home/static-content/apps/apps.component';
import { InfoEventsComponent } from './components/app-home/static-content/info-events/info-events.component';
import { CooperateComponent } from './components/app-home/static-content/cooperate/cooperate.component';
import { InfoDevelopersComponent } from './components/app-home/static-content/info-developers/info-developers.component';
import { InfoApisComponent } from './components/app-home/static-content/info-apis/info-apis.component';
import { InfoSparqlComponent } from './components/app-home/static-content/info-sparql/info-sparql.component';
import { FooterComponent } from './components/app-home/common/footer/footer.component';
import { OrgDetailComponent } from "./components/app-home/organism/org-detail/org-detail.component";
import { OrgsService } from "./services/orgs/orgs.service";
import { PageNotFoundComponent } from './components/exceptions/page-not-found/page-not-found.component';
import { HeaderComponent } from './components/app-home/common/header/header.component';
import { DatasetDetailComponent } from "./components/app-home/data/dataset-detail/dataset-detail.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Configuration } from "./app.constants";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AdminHomeComponent,
    DataCenterComponent,
    CampusComponent,
    LoginComponent,
    AppAdminComponent,
    GlobalAdminComponent,
    UsersComponent,
    RolesComponent,
    ContentComponent,
    DatasetsComponent,
    OrgsComponent,
    InfoComponent,
    ApplicationsComponent,
    EventsComponent,
    DevelopersComponent,
    ApisComponent,
    SparqlComponent,
    DataCenterHomeComponent,
    GlobalAdminHomeComponent,
    ShowDatasetComponent,
    EditDatasetComponent,
    ListDatasetComponent,
    AppHomeComponent,
    GlobalHomeComponent,
    DataComponent,
    TopicComponent,
    OrganismComponent,
    InformationComponent,
    AppsComponent,
    InfoEventsComponent,
    CooperateComponent,
    InfoDevelopersComponent,
    InfoApisComponent,
    InfoSparqlComponent,
    FooterComponent,
    OrgDetailComponent,
    PageNotFoundComponent,
    HeaderComponent,
    DatasetDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ChartModule,
    PanelModule,
    FieldsetModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
    ButtonModule,
    DataTableModule,
    SharedModule,
    MdSidenavModule,
    DialogModule,
    CalendarModule,
    InputSwitchModule,
    EditorModule,
    DataListModule,
    TooltipModule,
    AutoCompleteModule,
    ProgressBarModule,
    RadioButtonModule,
    CheckboxModule,
    FileUploadModule,
    TabViewModule,
    HttpClientModule,
    TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: (createTranslateLoader),
              deps: [HttpClient]
            }
        })
  ],
  providers: [DatasetService, TopicService, PublicadorService, OrgsService, Configuration],
  bootstrap: [AppComponent]
})
export class AppModule { }
