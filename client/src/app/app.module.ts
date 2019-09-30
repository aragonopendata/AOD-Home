import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
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
import { DatasetSearchComponent } from './components/web/datasets/datasets-list/dataset-search/dataset-search.component';
import { SearchItemComponent } from './components/web/datasets/datasets-list/dataset-search/search-item/search-item.component';
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
import { ForgottenPasswordComponent } from './components/login/forgotten-password/forgotten-password.component';
import { RestorePasswordComponent } from './components/login/restore-password/restore-password.component';
import { HomeAdminComponent } from './components/admin/home-admin.component';
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
import { InfoPanelsAdminComponent } from './components/admin/global/static-content-admin/info-panels-admin/info-panels-admin.component';
import { InfoListAdminComponent } from './components/admin/global/static-content-admin/info-list-admin/info-list-admin.component';
import { CampusAdminEventsComponent } from './components/admin/campus-admin/campus-admin-events/campus-admin-events.component';
import { CampusAdminEntriesComponent } from './components/admin/campus-admin/campus-admin-entries/campus-admin-entries.component';
import { CampusAdminSpeakersComponent } from './components/admin/campus-admin/campus-admin-speakers/campus-admin-speakers.component';
import { VisualDataComponent } from './components/admin/visual-data/visual-data.component';
import { SysAdminComponent } from './components/admin/global/sys-admin/sys-admin.component';
import { KnowledgeComponent } from './components/web/static-content/info/knowledge/knowledge.component';
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
import { GoogleAnalyticsEventsService } from "./services/web/google-analytics-events.service";
import { UtilsService } from './services/web/utils.service';
import { TinyMceModule } from 'angular-tinymce';
import { tinymceDefaultSettings } from 'angular-tinymce';
import { FilesAdminService } from './services/admin/files-admin.service';
import { AppInitService } from './app-init.service';

export function init_app(appLoadService: AppInitService) {
	return () => appLoadService.init();
}

let pages: any = [
	AppComponent,
	DatasetSearchComponent,
	SearchItemComponent,
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
	ForgottenPasswordComponent,
	RestorePasswordComponent,
	HomeAdminComponent,
	DashboardGlobalComponent,
	UsersAdminComponent,
	RolesAdminComponent,
	ApplicationsComponent,
	CollaborationComponent,
	EventsComponent,
	OpenDataComponent,
	ApisComponent,
	DevelopersComponent,
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
	VisualDataComponent,
	SysAdminComponent,
	KnowledgeComponent,
	InfoPanelsAdminComponent,
	InfoListAdminComponent,
	CampusAdminEventsComponent,
	CampusAdminEntriesComponent,
	CampusAdminSpeakersComponent
  ]

@NgModule({
	declarations: pages,
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
		AppInitService,
		{
			provide: APP_INITIALIZER,
			useFactory: init_app,
			deps: [AppInitService],
			multi: true
		},
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
		FilesAdminService,
		TopicsAdminService,
		OrganizationsAdminService,
		CampusAdminService,
		LogstashService,
		AnalyticsService,
		AodCoreAdminService,
		ConfirmationService,
		GoogleAnalyticsEventsService,
		UtilsService
	],
	bootstrap: [AppComponent]
})

export class AppModule { }
