import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	ChartModule, PanelModule, FieldsetModule, InputTextModule, DropdownModule,
	InputTextareaModule, ButtonModule, SharedModule, DataTableModule, DialogModule, 
	CalendarModule, InputSwitchModule, EditorModule, DataListModule, TooltipModule, 
	AutoCompleteModule, ProgressBarModule, RadioButtonModule, CheckboxModule, FileUploadModule, 
	ToolbarModule, TabViewModule, PaginatorModule, AccordionModule, MessagesModule, GrowlModule,
	ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { Logger, Options } from 'angular2-logger/core';
import { Constants } from './app.constants';
// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/web/home.component';
import { PageNotFoundComponent } from './components/error/page-not-found/page-not-found.component';
import { FooterComponent } from './components/web/common/footer/footer.component';
import { HeaderComponent } from './components/web/common/header/header.component';
import { DatasetAutocompleteComponent } from './components/web/datasets/dataset-autocomplete/dataset-autocomplete.component';
import { DatasetsListComponent } from './components/web/datasets/datasets-list/datasets-list.component';
import { DatasetsDetailComponent } from './components/web/datasets/datasets-detail/datasets-detail.component';
import { TopicsListComponent } from './components/web/topics/topics-list/topics-list.component';
import { OrganizationsDetailComponent } from './components/web/organizations/organizations-detail/organizations-detail.component';
import { OrganizationsListComponent } from './components/web/organizations/organizations-list/organizations-list.component';
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
import { ForgottenPasswordComponent } from './components/login/forgotten-password/forgotten-password.component';
import { RestorePasswordComponent } from './components/login/restore-password/restore-password.component';
import { HomeAdminComponent } from './components/admin/home-admin.component';
import { CampusAdminComponent } from './components/admin/campus-admin/campus-admin.component';
import { GlobalComponent } from './components/admin/global/global.component';
import { DashboardGlobalComponent } from './components/admin/global/dashboard-global/dashboard-global.component';
import { UsersAdminComponent } from './components/admin/global/users-admin/users-admin.component';
import { RolesAdminComponent } from './components/admin/global/roles-admin/roles-admin.component';
import { DashboardDatacenterComponent } from './components/admin/datacenter/dashboard-datacenter/dashboard-datacenter.component';
import { DatacenterComponent } from './components/admin/datacenter/datacenter.component';
import { OrganizationsAdminComponent } from './components/admin/datacenter/organizations-admin/organizations-admin.component';
import { OrganizationsAdminListComponent } from './components/admin/datacenter/organizations-admin/organizations-admin-list/organizations-admin-list.component';
import { OrganizationsAdminShowComponent } from './components/admin/datacenter/organizations-admin/organizations-admin-show/organizations-admin-show.component';
import { OrganizationsAdminEditComponent } from './components/admin/datacenter/organizations-admin/organizations-admin-edit/organizations-admin-edit.component';
import { DatasetsAdminComponent } from './components/admin/datacenter/datasets-admin/datasets-admin.component';
import { DatasetsAdminShowComponent } from './components/admin/datacenter/datasets-admin/datasets-admin-show/datasets-admin-show.component';
import { DatasetsAdminEditComponent } from './components/admin/datacenter/datasets-admin/datasets-admin-edit/datasets-admin-edit.component';
import { DatasetsAdminListComponent } from './components/admin/datacenter/datasets-admin/datasets-admin-list/datasets-admin-list.component';
import { LogstashComponent } from './components/admin/logstash/logstash.component';
// Pipes
import { EventSafeHtmlPipe } from './components/web/static-content/info/events/events-safeHTML.pipe';
import { OpenDataSafeHtmlPipe } from "./components/web/static-content/info/open-data/open-data-safeHTML.pipe";
import { ApiSafeHtmlPipe } from "./components/web/static-content/tools/apis/apis-safeHTML.pipe";
import { DeveloperSafeHtmlPipe } from "./components/web/static-content/tools/developers/developers-safeHTML.pipe";
// Services
import { AuthenticationService } from './services/security/authentication.service';
import { LoginService } from './services/security/login.service';
import { DatasetsService } from './services/web/datasets.service';
import { TopicsService } from './services/web/topics.service';
import { OrganizationsService } from './services/web/organizations.service';
import { StaticContentService } from './services/web/static-content.service';
import { CampusService } from './services/web/campus.service';
import { UsersAdminService } from './services/admin/users-admin.service';
import { RolesAdminService } from './services/admin/roles-admin.service';
import { StaticContentAdminService } from './services/admin/static-content-admin.service';
import { DatasetsAdminService } from './services/admin/datasets-admin.service';
import { TopicsAdminService } from './services/admin/topics-admin.service';
import { OrganizationsAdminService } from './services/admin/organizations-admin.service';
import { CampusAdminService } from './services/admin/campus-admin.service';
import { LogstashService } from './services/admin/logstash.service';
import { AnalyticsService } from './services/web/analytics.service';
import { AodCoreAdminService} from './services/admin/aod-core-admin.service';
import {GoogleAnalyticsEventsService} from "./services/web/google-analytics-events.service";
import { TinyMceModule } from 'angular-tinymce';
import { tinymceDefaultSettings } from 'angular-tinymce';
import { InfoPanelsAdminComponent } from './components/admin/global/static-content-admin/info-panels-admin/info-panels-admin.component';
import { InfoListAdminComponent } from './components/admin/global/static-content-admin/info-list-admin/info-list-admin.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		PageNotFoundComponent,
		HomeComponent,
		FooterComponent,
		HeaderComponent,
		DatasetAutocompleteComponent,
		DatasetsListComponent,
		DatasetsDetailComponent,
		TopicsListComponent,
		OrganizationsDetailComponent,
		OrganizationsListComponent,
		OpenDataComponent,
		TermsComponent,
		OpenDataSafeHtmlPipe,
		EventSafeHtmlPipe,
		ApiSafeHtmlPipe,
		DeveloperSafeHtmlPipe,
		ApplicationsComponent,
		EventsComponent,
		CollaborationComponent,
		AnalyticsComponent,
		CampusComponent,
		CampusDetailComponent,
		DevelopersComponent,
		ApisComponent,
		SparqlComponent,
		SparqlClientComponent,
		ForgottenPasswordComponent,
		RestorePasswordComponent,
		HomeAdminComponent,
		CampusAdminComponent,
		DashboardGlobalComponent,
		UsersAdminComponent,
		RolesAdminComponent,
		ApplicationsComponent,
		CollaborationComponent,
		EventsComponent,
		OpenDataComponent,
		ApisComponent,
		DevelopersComponent,
		SparqlComponent,
		DashboardDatacenterComponent,
		OrganizationsAdminComponent,
		OrganizationsAdminListComponent,
		OrganizationsAdminShowComponent,
		OrganizationsAdminEditComponent,
		DatasetsAdminComponent,
		DatasetsAdminShowComponent,
		DatasetsAdminEditComponent,
		DatasetsAdminListComponent,
		LogstashComponent,
		DatacenterComponent,
		GlobalComponent,
		InfoPanelsAdminComponent,
		InfoListAdminComponent
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
		ConfirmDialogModule,
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
		PaginatorModule,
		AccordionModule,
		MessagesModule,
		GrowlModule,
		TinyMceModule.forRoot(tinymceDefaultSettings())
	],
	providers: [
		Logger,
		Constants,
		AuthenticationService,
		LoginService,
		DatasetsService,
		TopicsService,
		OrganizationsService,
		StaticContentService,
		CampusService,
		UsersAdminService,
		RolesAdminService,
		StaticContentAdminService,
		DatasetsAdminService,
		TopicsAdminService,
		OrganizationsAdminService,
		CampusAdminService,
		LogstashService,
		AnalyticsService,
		AodCoreAdminService,
		ConfirmationService,
		GoogleAnalyticsEventsService
	],
	bootstrap: [AppComponent]
})

export class AppModule { }
