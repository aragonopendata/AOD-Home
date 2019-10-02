import { OrganizationsService } from './../../../../services/web/organizations.service';
import { Organization } from './../../../../models/Organization';
import { Component, OnInit, Input, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Location, PlatformLocation } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem, DropdownModule } from 'primeng/primeng';
import { DatasetsService } from '../../../../services/web/datasets.service';
import { TopicsService } from '../../../../services/web/topics.service';
import { TopicsListComponent } from '../../topics/topics-list/topics-list.component';
import { Dataset } from '../../../../models/Dataset';
import { DatasetHomer } from '../../../../models/DatasetHomer';
import { Topic } from '../../../../models/Topic';
import { Constants } from '../../../../app.constants';
import { NavigationEnd, Event } from '@angular/router';
import { Autocomplete } from 'app/models/Autocomplete';
import { Observable } from 'rxjs';
import { UtilsService } from '../../../../services/web/utils.service';

@Component({
    selector: 'app-datasets-list',
    templateUrl: './datasets-list.component.html',
    styleUrls: ['./datasets-list.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class DatasetsListComponent implements OnInit {

    openedMenu: boolean;

    selectedTopic: string;
    selectedOrg: string;
    selectedType: string;
    selectedGroup: string;
    selectedLang: string;
    selectedSearchOption: string;
    selectedSubGroup: string;
    selectedOrgTopic: boolean;
    sort: string;
    sortHomer: string;
    datasets: Dataset[];
    datasetsAutocomplete: Autocomplete[];
    queryToSearch: string = '';
    datasetsHomer: DatasetHomer[];
    newestDatasets: Dataset[];
    downloadedDatasets: Dataset[];
    dataset: Dataset;
    numDatasets: number;
    numDatasetsHomer: number;
    pageRows: number;
    totalDataset: string[];
    datasetCount: SelectItem[];
    resourceCount: SelectItem[];
    textSearch: string;
    textSearchHomer: string;
    searchHomerValue: string = '';
    tags: any[];
    filteredTagsMultiple: any[];
    hideLastUpdateColumn: boolean;
    hideAccessNumberColumn: boolean;
    siuTopic: string[];
    siuOrganization: string[];

    @Input() topics: Topic[];
    topic: Topic;
    topicsSelect: SelectItem[];
    orgs: Organization[];
    orgsSelect: SelectItem[];
    datasetTypes: SelectItem[];
    searchOptions: SelectItem[];
    langsSelect: SelectItem[];
    groupSelect: SelectItem[];
    subGroupTerritorioSelect: SelectItem[];
    subGroupDemografiaSelect: SelectItem[];
    subGroupEducacionSelect: SelectItem[];
    subGroupSaludSelect: SelectItem[];
    subGroupNivelCalidadVidaSelect: SelectItem[];
    subGroupAnalisisSocialesSelect: SelectItem[];
    subGroupTrabajoSalariosSelect: SelectItem[];
    subGroupAgriculturaSelect: SelectItem[];
    subGroupServiciosSelect: SelectItem[];
    subGroupPreciosSelect: SelectItem[];
    subGroupPIBSelect: SelectItem[];
    subGroupFinancierasSelect: SelectItem[];
    subGroupIDITicSelect: SelectItem[];
    subGroupMedioAmbienteSelect: SelectItem[];
    subGroupSectorPublicoSelect: SelectItem[];
    emptyMessage: string;

    groupsOptionTerritorio: string;
    groupsOptionDemografia: string;
    groupsOptionEducacion: string;
    groupsOptionSalud: string;
    groupsOptionNivelCalidadVida: string;
    groupsOptionAnalisisSociales: string;
    groupsOptionTrabajoSalarios: string;
    groupsOptionAgricultura: string;
    groupsOptionServicios: string;
    groupsOptionPrecios: string;
    groupsOptionPib: string;
    groupsOptionFinancieras: string;
    groupsOptionIDITic: string;
    groupsOptionMedioAmbiente: string;
    groupsOptionSectorPublico: string;

    datasetSearchOptionFreeSearch: string;
    datasetSearchOptionTopics: string;
    datasetSearchOptionOrganizations: string;
    datasetSearchOptionTags: string;
    datasetSearchOptionStats: string;
    datasetSearchOptionHomer: string;
    datasetSearchOptionSiu: string;
    //Dynamic URL build parameters
    routerLinkPageNotFound: string;
    routerLinkDataCatalog: string;
    routerLinkDataCatalogDataset: string;
    routerLinkDataCatalogTopics: string;
    routerLinkDataCatalogOrganizations: string;
    routerLinkDataCatalogSearchOrganizations: string;
    routerLinkDataCatalogTags: string;
    routerLinkDataCatalogDatasetHomer: string;
    routerLinkDataCatalogSiu: string;
    //Pagination Params
    pages: number[];
    actualPage: number;
    pagesShow: string[];
    pageFirst: number;
    pageLast: number;
    //Error Params
    errorTitle: string;
    errorMessage: string;
    datasetListErrorTitle: string;
    datasetListErrorMessage: string;
    f1_title: string = "Organizaciones";
    f2_title: string = "Temas";

    constructor(private datasetsService: DatasetsService, private topicsService: TopicsService
            , private orgsService: OrganizationsService, private router: Router
            , private location: Location, private changeDetectorRef: ChangeDetectorRef
            , private activatedRoute: ActivatedRoute, private loc: PlatformLocation,
            private utilsService: UtilsService) {
        this.datasetListErrorTitle = Constants.DATASET_LIST_ERROR_TITLE;
        this.datasetListErrorMessage = Constants.DATASET_LIST_ERROR_MESSAGE;
        this.pageRows = Constants.DATASET_LIST_ROWS_PER_PAGE;
        this.routerLinkDataCatalog = Constants.ROUTER_LINK_DATA_CATALOG;
        this.routerLinkDataCatalogDataset = Constants.ROUTER_LINK_DATA_CATALOG_DATASET;
        this.routerLinkDataCatalogTopics = Constants.ROUTER_LINK_DATA_CATALOG_TOPICS;
        this.routerLinkDataCatalogOrganizations = Constants.ROUTER_LINK_DATA_CATALOG_ORGANIZATIONS;
        this.routerLinkDataCatalogSearchOrganizations = Constants.ROUTER_LINK_DATA_CATALOG_SEARCH;
        this.routerLinkDataCatalogTags = Constants.ROUTER_LINK_DATA_CATALOG_TAGS;
        this.routerLinkDataCatalogSiu = Constants.ROUTER_LINK_DATA_CATALOG_SIU;
        this.datasetSearchOptionFreeSearch = Constants.DATASET_LIST_SEARCH_OPTION_FREE_SEARCH;
        this.datasetSearchOptionTopics = Constants.DATASET_LIST_SEARCH_OPTION_TOPICS;
        this.datasetSearchOptionOrganizations = Constants.DATASET_LIST_SEARCH_OPTION_ORGANIZATIONS;
        this.datasetSearchOptionTags = Constants.DATASET_LIST_SEARCH_OPTION_TAGS;
        this.datasetSearchOptionStats = Constants.DATASET_LIST_SEARCH_OPTION_STATS;
        this.datasetSearchOptionHomer = Constants.DATASET_LIST_SEARCH_OPTION_HOMER;
        this.datasetSearchOptionSiu = Constants.DATASET_LIST_SEARCH_OPTION_ORGANIZATION_TOPIC;
        this.routerLinkDataCatalogDatasetHomer = Constants.ROUTER_LINK_DATA_CATALOG_HOMER_DATASET;
        this.emptyMessage = Constants.DATASET_LIST_EMPTY;

        if (router.url.indexOf(Constants.DATA_TOPICS) > -1) {
            this.selectedSearchOption = this.datasetSearchOptionTopics;
        } else if(router.url.indexOf(Constants.ROUTER_LINK_DATA_PARAM_TAG)>-1){
            this.selectedSearchOption = this.datasetSearchOptionTags;
        } else if(router.url.indexOf(Constants.ROUTER_LINK_DATA_CATALOG_SIU) > -1){
            this.selectedSearchOption = this.datasetSearchOptionSiu;
        } else if(router.url.indexOf(Constants.ROUTER_LINK_DATA_CATALOG_SEARCH) > -1){
            this.selectedSearchOption = this.datasetSearchOptionOrganizations; 
        } else if(router.url.indexOf(Constants.ROUTER_LINK_DATA_CATALOG_STATS) > -1){
            this.selectedSearchOption = this.datasetSearchOptionStats;
        } else if (this.selectedSearchOption === undefined) {
            this.selectedSearchOption = this.datasetSearchOptionFreeSearch; 
        }
        this.groupsOptionTerritorio = Constants.DATASET_LIST_DROPDOWN_GROUPS_TERRITORIO.value;
        this.groupsOptionDemografia = Constants.DATASET_LIST_DROPDOWN_GROUPS_DEMOGRAFIA.value;
        this.groupsOptionEducacion = Constants.DATASET_LIST_DROPDOWN_GROUPS_EDUCACION.value;
        this.groupsOptionSalud = Constants.DATASET_LIST_DROPDOWN_GROUPS_SALUD.value;
        this.groupsOptionNivelCalidadVida = Constants.DATASET_LIST_DROPDOWN_GROUPS_NIVELCALIDADVIDA.value;
        this.groupsOptionAnalisisSociales = Constants.DATASET_LIST_DROPDOWN_GROUPS_ANALISISSOCIALES.value;
        this.groupsOptionTrabajoSalarios = Constants.DATASET_LIST_DROPDOWN_GROUPS_TRABAJOSALARIOS.value;
        this.groupsOptionAgricultura = Constants.DATASET_LIST_DROPDOWN_GROUPS_AGRICULTURA.value;
        this.groupsOptionServicios = Constants.DATASET_LIST_DROPDOWN_GROUPS_SERVICIOS.value;
        this.groupsOptionPrecios = Constants.DATASET_LIST_DROPDOWN_GROUPS_PRECIOS.value;
        this.groupsOptionPib = Constants.DATASET_LIST_DROPDOWN_GROUPS_PIB.value;
        this.groupsOptionFinancieras = Constants.DATASET_LIST_DROPDOWN_GROUPS_FINANCIERAS.value;
        this.groupsOptionIDITic = Constants.DATASET_LIST_DROPDOWN_GROUPS_IDITIC.value;
        this.groupsOptionMedioAmbiente = Constants.DATASET_LIST_DROPDOWN_GROUPS_MEDIOAMBIENTE.value;
        this.groupsOptionSectorPublico = Constants.DATASET_LIST_DROPDOWN_GROUPS_SECTORPUBLICO.value;
        this.getOpenedMenu();
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            try {
                if(this.selectedSearchOption === this.datasetSearchOptionSiu) {
                    this.siuOrganization = params["org"] !== undefined ? params["org"].split(' ') : [];
                    this.siuTopic = params["tema"] !== undefined ? params["tema"].split(' ') : [];
                }else {
                    this.textSearch = params[Constants.ROUTER_LINK_DATA_PARAM_TEXT];
                    this.selectedType = params[Constants.ROUTER_LINK_DATA_PARAM_TYPE];
                    if (params[Constants.ROUTER_LINK_DATA_PARAM_TAG]) {
                        let tagParams: string = '' + params[Constants.ROUTER_LINK_DATA_PARAM_TAG];
                        let tags = [] = tagParams.split(',');
                        let filtered = [];
                        for (let i = 0; i < tags.length; i++) {
                            filtered.push({ name: tags[i], value: tags[i] });
                        }
                        this.tags = filtered;
                    }
                    this.selectedLang = params[Constants.ROUTER_LINK_DATA_PARAM_LANG];
                    this.textSearchHomer = params[Constants.ROUTER_LINK_DATA_PARAM_TEXT_HOMER];
                }
            } catch (error) {
                console.error('Error: ngOnInit() queryParams - datasets-list.component.ts');
            }
        });

        this.activatedRoute.params.subscribe(params => {
            try {
                this.selectedTopic = params[Constants.ROUTER_LINK_DATA_PARAM_TOPIC_NAME];
                this.selectedOrg = params[Constants.ROUTER_LINK_DATA_PARAM_ORGANIZATION_NAME];
                if(params[Constants.ROUTER_LINK_DATA_PARAM_STATS_GROUP]){
                    if (params[Constants.ROUTER_LINK_DATA_PARAM_STATS_GROUP].length == 2){
                        this.selectedGroup = params[Constants.ROUTER_LINK_DATA_PARAM_STATS_GROUP];
                    }else{
                        this.selectedGroup = params[Constants.ROUTER_LINK_DATA_PARAM_STATS_GROUP];
                        this.selectedGroup = this.selectedGroup.substring(0,2);
                        this.selectedSubGroup = params[Constants.ROUTER_LINK_DATA_PARAM_STATS_GROUP];
                    }
                }
            } catch (error) {
                console.error('Error: ngOnInit() params - datasets-list.component.ts');
            }
        });

        this.sort = Constants.SERVER_API_LINK_PARAM_SORT_DEFAULT_VALUE;
        this.sortHomer = Constants.SERVER_API_LINK_PARAM_SORT_HOMER_DEFAULT_VALUE;
        this.setDatasetsStats();
        this.setTopicsDropdown();
        this.setOrgsDropdown();
        this.loadDatasets();
        this.setDatasetsTypeDropdown();
        this.setSearchOptions();
        this.setLanguagesDropdown();
        this.setGroupsDropdown();
        this.setSubGroupsDropdown();
        this.setInfoTables();
        this.onResize();
    }

    loadDatasets() {
        this.datasets = [];
        if(this.textSearch != undefined && Constants.DATASET_LIST_SEARCH_OPTION_FREE_SEARCH === this.selectedSearchOption){
            this.searchDatasetsByText();
        } else {
            this.location.go('/' + this.routerLinkDataCatalog);
            this.textSearch = "";
            if (Constants.DATASET_LIST_SEARCH_OPTION_FREE_SEARCH === this.selectedSearchOption) {
                this.selectedTopic = undefined;
                this.selectedOrg = undefined;
                this.selectedType = undefined;
                this.tags = [];
                this.selectedGroup = undefined;
                this.selectedSubGroup = undefined;
                this.selectedOrgTopic = false;
                this.location.go('/' + this.routerLinkDataCatalog);
                this.getDatasets(null, null);
            } else if (Constants.DATASET_LIST_SEARCH_OPTION_TOPICS === this.selectedSearchOption) {
                this.selectedOrgTopic = false;
                this.textSearch = "";
                this.selectedOrg = undefined;
                this.selectedType = undefined;
                this.tags = [];
                this.selectedGroup = undefined;
                this.selectedSubGroup = undefined;
                this.changeType();
                this.selectedSearchOption = this.datasetSearchOptionTopics;
            } else if (Constants.DATASET_LIST_SEARCH_OPTION_ORGANIZATION_TOPIC === this.selectedSearchOption) {
                this.textSearch = "";
                this.selectedOrgTopic = true;
                this.getDatasetByOrganizationTopic(this.siuOrganization, this.siuTopic, null, null);
            }else if (Constants.DATASET_LIST_SEARCH_OPTION_ORGANIZATIONS === this.selectedSearchOption) {
                this.selectedOrgTopic = false;
                this.selectedTopic = undefined;
                this.selectedType = undefined;
                this.tags = [];
                this.textSearch = "";
                this.selectedGroup = undefined;
                this.selectedSubGroup = undefined;
                this.changeType();
                this.selectedSearchOption = this.datasetSearchOptionOrganizations;
            } else if (Constants.DATASET_LIST_SEARCH_OPTION_TAGS === this.selectedSearchOption) {
                this.selectedTopic = undefined;
                this.selectedOrgTopic = false;
                this.selectedOrg = undefined;
                this.selectedType = undefined;
                this.textSearch = "";
                this.selectedGroup = undefined;
                this.selectedSubGroup = undefined;
                this.changeTags();
                this.selectedSearchOption = this.datasetSearchOptionTags;
            } else if (this.selectedSearchOption == this.datasetSearchOptionHomer) {
                this.selectedTopic = undefined;
                this.selectedOrgTopic = false;
                this.selectedOrg = undefined;
                this.selectedType = undefined;
                this.textSearch = "";
                this.selectedGroup = undefined;
                this.selectedSubGroup = undefined;
                this.tags = [];
                this.selectedSearchOption = this.datasetSearchOptionHomer;
                this.getDatasetsByHomer(null, null);
            } else if (this.selectedSearchOption == this.datasetSearchOptionStats) {
                this.selectedSearchOption = this.datasetSearchOptionStats;
                this.selectedOrgTopic = false;
                this.selectedTopic = undefined;
                this.selectedOrg = undefined;
                this.selectedType = undefined;
                this.textSearch = "";
                this.tags = [];
                this.changeStats();
            } else {
                this.getDatasets(null, null);
            }
        }
        
    }

    setPagination(actual: number, total: number) {
        this.actualPage = actual;
        this.pageFirst = 0;
        this.pageLast = Math.ceil(+total / +this.pageRows);
        this.pages = [];
        this.pagesShow = [];
        if (this.pageLast == 0) {
            this.pagesShow.push('-');
        }
        for (var index = 0; index < this.pageLast; index++) {
            this.pages.push(+index + 1);
        }
        if (this.actualPage < 4) {
            for (var index = 0; index < 5; index++) {
                if (this.pages[index]) {
                    this.pagesShow.push(String(+this.pages[index]));
                }
            }
        } else if (this.actualPage >= (135)) {
            for (var index = (+this.pageLast - 5); index < this.pageLast; index++) {
                if (this.pages[index]) {
                    this.pagesShow.push(String(+this.pages[index]));
                }
            }
        } else {
            for (var index = (+actual - 2); index <= (+this.actualPage + 2); index++) {
                if (this.pages[index]) {
                    this.pagesShow.push(String(+this.pages[index]));
                }
            }
        }
    }

    paginate(page: number) {
        --page;
        if (this.textSearch) {
            this.getDatasetsBySearch(page, this.pageRows, this.textSearch);
        } else if (this.selectedOrgTopic) {
            this.selectedSearchOption = this.datasetSearchOptionSiu;
            this.getDatasetByOrganizationTopic(this.siuOrganization, this.siuTopic, page, this.pageRows);
        } else if (this.selectedTopic) {
            this.getDatasetsByTopic(this.selectedTopic, page, this.pageRows, this.selectedType);
            this.selectedSearchOption = this.datasetSearchOptionTopics;
        } else if (this.selectedOrg) {
            this.getDatasetsByOrg(page, this.pageRows, this.selectedOrg, this.selectedType);
            this.selectedSearchOption = this.datasetSearchOptionOrganizations;
        } else if (this.selectedSearchOption == this.datasetSearchOptionStats) {
            this.getDatasetsByStats(this.selectedSubGroup, page, this.pageRows);
            this.selectedSearchOption = this.datasetSearchOptionStats;
        } else if (this.tags[0]) {
            this.getDatasetsByTags(page, this.pageRows);
            this.selectedSearchOption = this.datasetSearchOptionTags;
        } else if (this.selectedSearchOption == this.datasetSearchOptionHomer) {
            this.getDatasetsByHomer(page, this.pageRows);
        } else if (this.textSearchHomer) {
            this.selectedSearchOption = this.datasetSearchOptionHomer;
            this.searchHomerValue = this.textSearchHomer;
            this.getDatasetsByHomer(page, this.pageRows);
        } else {
            this.getDatasets(page, this.pageRows);
        }
        document.body.scrollTop = 0;
    }

    changeType() {
        if (this.selectedTopic) {
            if (this.selectedOrg) {
                console.log("Prueba");
            } else if (this.selectedType) {
                this.router.navigate(['/' + this.routerLinkDataCatalogTopics + '/' + this.selectedTopic], { queryParams: { tipo: this.selectedType } });
                this.location.go('/' + this.routerLinkDataCatalogTopics + '/' + this.selectedTopic
                    + '?' + Constants.ROUTER_LINK_DATA_PARAM_TYPE + '=' + this.selectedType);
                this.getDatasetsByTopic(this.selectedTopic, null, null, this.selectedType);
            } else {
                this.location.go('/' + this.routerLinkDataCatalogTopics + '/' + this.selectedTopic);
                this.getDatasetsByTopic(this.selectedTopic, null, null, null);
            }
        } else if (this.selectedOrg) {
            if (this.selectedType) {
                this.location.go('/' + this.routerLinkDataCatalogSearchOrganizations + '/' + this.selectedOrg
                + '?' + Constants.ROUTER_LINK_DATA_PARAM_TYPE + '=' + this.selectedType);
                this.getDatasetsByOrg(null, null, this.selectedOrg, this.selectedType);
            } else {
                this.location.go('/' + this.routerLinkDataCatalogSearchOrganizations + '/' + this.selectedOrg);
                this.getDatasetsByOrg(null, null, this.selectedOrg, null);
            }
        } else {
            if (this.selectedType) {
                this.location.go('/' + this.routerLinkDataCatalog
                    + '?' + Constants.ROUTER_LINK_DATA_PARAM_TYPE + '=' + this.selectedType);
            } else {
                this.location.go('/' + this.routerLinkDataCatalog);
            }
            this.getDatasets(null, null);
        }
    }

    changeStats() {
        if (this.selectedGroup != undefined){
            if (this.selectedSubGroup != undefined) {
                this.location.go('/' + Constants.ROUTER_LINK_DATA_CATALOG_STATS + '/' + this.selectedSubGroup);
                this.getDatasetsByStats(this.selectedSubGroup, null, null);
            } else {
                this.location.go('/' + Constants.ROUTER_LINK_DATA_CATALOG_STATS + '/' + this.selectedGroup);
                this.getDatasetsByStats(this.selectedGroup, null, null);
            }
        } else {
            this.location.go('/' + Constants.ROUTER_LINK_DATA_CATALOG_STATS);
            this.getDatasetsByStats(this.selectedSubGroup, null, null);
        }
    }

    changeTags() {
        if (this.tags.length > 0) {
            let tagsList = [];
            let tagUrl = '';
            tagsList = this.tags;
            let i = 0;
            tagsList.forEach(tag => {
                if (i == 0) {
                    tagUrl += '?' + Constants.ROUTER_LINK_DATA_PARAM_TAG + '=' + tag.name;
                } else {
                    tagUrl += '&' + Constants.ROUTER_LINK_DATA_PARAM_TAG + '=' + tag.name;
                }
                i++;
            });
            this.location.go('/' + this.routerLinkDataCatalogTags + tagUrl);
            this.getDatasetsByTags(null, null);
        } else {
            this.location.go('/' + this.routerLinkDataCatalog);
            this.getDatasets(null, null);
        }
    }

    callbackOrgTopic(filters){
        this.textSearch = "";
        this.selectedOrgTopic = true;

        let orgs = filters.map(x => {return x.f1}).filter(x => {return x !== undefined && x !== ''});
        let topics = filters.map(x => {return x.f2}).filter(x => {return x !== undefined && x !== ''});

        this.siuOrganization = orgs;
        this.siuTopic = topics;

        this.getDatasetByOrganizationTopic(orgs, topics, null, null);
    }

    resetSubGroupSearch() {
        this.selectedSubGroup = undefined;
    }

    showDataset(dataset: Dataset) {
        this.topicsService.setTopic(this.topic);
        this.datasetsService.setDataset(dataset);
    }

    showDatasetHomer(datasetHomer: DatasetHomer) {
        this.datasetsService.setDatasetHomer(datasetHomer);
    }

    addDataset() {
        this.dataset = new Dataset();
        this.datasetsService.setDataset(this.dataset);
    }

    setOrder(event) {
        event.page = 0;
        switch (event.field) {
            case Constants.DATASET_LIST_SORT_COLUMN_NAME:
                this.sort == Constants.SERVER_API_LINK_PARAM_SORT_TITLE_STRING
                    ? this.sort = '-' + Constants.SERVER_API_LINK_PARAM_SORT_TITLE_STRING
                    : this.sort = Constants.SERVER_API_LINK_PARAM_SORT_TITLE_STRING;
                break;
            case Constants.DATASET_LIST_SORT_COLUMN_ACCESS:
                this.sort == Constants.SERVER_API_LINK_PARAM_SORT_VIEWS_TOTAL
                    ? this.sort = '-' + Constants.SERVER_API_LINK_PARAM_SORT_VIEWS_TOTAL
                    : this.sort = Constants.SERVER_API_LINK_PARAM_SORT_VIEWS_TOTAL;
                break;
            case Constants.DATASET_LIST_SORT_COLUMN_LAST_UPDATE:
                this.sort == Constants.SERVER_API_LINK_PARAM_SORT_METADATA_MODIFIED
                    ? this.sort = '-' + Constants.SERVER_API_LINK_PARAM_SORT_METADATA_MODIFIED
                    : this.sort = Constants.SERVER_API_LINK_PARAM_SORT_METADATA_MODIFIED;
                break;
        }
        this.loadDatasets();
        this.changeDetectorRef.detectChanges();
    }

    setOrderHomer(event) {
        event.page = 0;
        switch (event.field) {
            case Constants.DATASET_LIST_HOMER_SORT_COLUMN_NAME:
                this.sortHomer == Constants.SERVER_API_LINK_PARAM_SORT_HOMER_NAME
                    ? this.sortHomer = '-' + Constants.SERVER_API_LINK_PARAM_SORT_HOMER_NAME
                    : this.sortHomer = Constants.SERVER_API_LINK_PARAM_SORT_HOMER_NAME;
                break;
            case Constants.DATASET_LIST_HOMER_SORT_COLUMN_PORTAL:
                this.sortHomer == Constants.SERVER_API_LINK_PARAM_SORT_HOMER_PORTAL
                    ? this.sortHomer = '-' + Constants.SERVER_API_LINK_PARAM_SORT_HOMER_PORTAL
                    : this.sortHomer = Constants.SERVER_API_LINK_PARAM_SORT_HOMER_PORTAL;
                break;
            case Constants.DATASET_LIST_HOMER_SORT_COLUMN_LANGUAGE:
                this.sortHomer == Constants.SERVER_API_LINK_PARAM_SORT_HOMER_LANGUAGE
                    ? this.sortHomer = '-' + Constants.SERVER_API_LINK_PARAM_SORT_HOMER_LANGUAGE
                    : this.sortHomer = Constants.SERVER_API_LINK_PARAM_SORT_HOMER_LANGUAGE;
                break;
        }
        this.loadDatasets();
        this.changeDetectorRef.detectChanges();
    }

    getDatasets(page: number, rows: number): void {
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasets(this.sort, pageNumber, rowsNumber, this.selectedType).subscribe(datasets => {
            try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
                this.setPagination(pageNumber, this.numDatasets);
            } catch (error) {
                console.error('Error: getDatasets() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });
    }

    getDatasetsByTopic(topic: string, page: number, rows: number, type: string): void {
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsByTopic(topic, this.sort, pageNumber, rowsNumber, type).subscribe(datasets => {
            try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
                this.setPagination(pageNumber, this.numDatasets);
            } catch (error) {
                console.error('Error: getDatasetsByTopic() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });
    }

    getDatasetsByStats(group: string, page: number, rows: number): void {
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsByStats(this.sort, pageNumber, rowsNumber, group).subscribe(datasets => {
            try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
                this.setPagination(pageNumber, this.numDatasets);
            } catch (error) {
                console.error('Error: getDatasetsByStatistics() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });
    }

    getDatasetsBySearch(page: number, rows: number, searchParam: string): void {
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsByText(this.sort, pageNumber, rowsNumber, searchParam).subscribe(datasets => {
            try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
                this.setPagination(pageNumber, this.numDatasets);
            } catch (error) {
                console.error('Error: getDatasetsBySearch() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });
    }

    getDatasetsByOrg(page: number, rows: number, org: string, type: string): void {
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsByOrganization(org, this.sort, pageNumber, rowsNumber, type).subscribe(datasets => {
            try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
                this.setPagination(pageNumber, this.numDatasets);
            } catch (error) {
                console.error('Error: getDatasetsByOrg() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });
    }

    getDatasetsByTags(page: number, rows: number): void {
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsBytags(this.sort, pageNumber, rowsNumber, this.tags).subscribe(datasets => {
            try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
                this.setPagination(pageNumber, this.numDatasets);
            } catch (error) {
                console.error('Error: getDatasetsByTags() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });

    }

    getDatasetsByHomer(page: number, rows: number): void {
        this.datasetsHomer = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        if(this.searchHomerValue == ''){
            var lang = Constants.UNDEFINED;
        }else{
            lang = this.selectedLang;
        }
        this.datasetsService.getDatasetsHomer(this.sortHomer, pageNumber, rowsNumber, this.searchHomerValue, lang).subscribe(datasetsHomer => {
            try {
                this.datasetsHomer = JSON.parse(datasetsHomer).response.docs;
                this.numDatasetsHomer = JSON.parse(datasetsHomer).response.numFound;
                this.setPagination(pageNumber, this.numDatasetsHomer);
            } catch (error) {
                console.error('Error: getDatasetsByHomer() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });
    }

    getDatasetByOrganizationTopic(orgs, topics, page: number, rows: number): void {
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);

        this.datasetsService.getDatasetsByOrganizationTopic(this.sort, pageNumber, rowsNumber, orgs, topics).subscribe(datasets => {
            try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
                this.setPagination(pageNumber, this.numDatasets);
            } catch (error) {
                console.error('Error: getDatasetsByTags() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });

    }

    setTopicsDropdown() {
        this.getSelectedTopic();
        this.topicsSelect = [];
        this.topicsSelect.push({ label: 'Todos los temas', value: undefined });
        this.topicsService.getTopics().subscribe(topics => {
            try {
                this.topics = JSON.parse(topics).result;
                for (let top of this.topics) {
                    this.topicsSelect.push({ label: top.title, value: top.name });
                }
            } catch (error) {
                console.error('Error: setTopicsDropdown() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });
    }

    setOrgsDropdown() {
        this.orgsSelect = [];
        this.orgsSelect.push({ label: 'Todas las organizaciones', value: undefined });
        this.orgsService.getOrganizations().subscribe(orgs => {
            try {
                this.orgs = JSON.parse(orgs).result;
                for (let org of this.orgs) {
                    this.orgsSelect.push({ label: org.title, value: org.name });
                }
            } catch (error) {
                console.error('Error: setOrgsDropdown() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });
    }

    getSelectedTopic() {
        if (this.topicsService.getTopic() !== undefined) {
            this.selectedTopic = this.topicsService.getTopic().name;
        }
    }

    setDatasetsTypeDropdown() {
        this.datasetTypes = [];
        this.datasetTypes.push({ label: Constants.DATASET_LIST_DROPDOWN_TYPE_ALL, value: undefined });
        this.datasetTypes.push({ label: Constants.DATASET_LIST_DROPDOWN_TYPE_CALENDARIO_LABEL, value: Constants.DATASET_LIST_DROPDOWN_TYPE_CALENDARIO_VALUE });
        this.datasetTypes.push({ label: Constants.DATASET_LIST_DROPDOWN_TYPE_FOTOS_LABEL, value: Constants.DATASET_LIST_DROPDOWN_TYPE_FOTOS_VALUE });
        this.datasetTypes.push({ label: Constants.DATASET_LIST_DROPDOWN_TYPE_HOJAS_CALCULO_LABEL, value: Constants.DATASET_LIST_DROPDOWN_TYPE_HOJAS_CALCULO_VALUE });
        this.datasetTypes.push({ label: Constants.DATASET_LIST_DROPDOWN_TYPE_MAPAS_LABEL, value: Constants.DATASET_LIST_DROPDOWN_TYPE_MAPAS_VALUE });
        this.datasetTypes.push({ label: Constants.DATASET_LIST_DROPDOWN_TYPE_RECURSOS_EDUCATIVOS_LABEL, value: Constants.DATASET_LIST_DROPDOWN_TYPE_RECURSOS_EDUCATIVOS_VALUE });
        this.datasetTypes.push({ label: Constants.DATASET_LIST_DROPDOWN_TYPE_RECURSOS_WEB_LABEL, value: Constants.DATASET_LIST_DROPDOWN_TYPE_RECURSOS_WEB_VALUE });
        this.datasetTypes.push({ label: Constants.DATASET_LIST_DROPDOWN_TYPE_RSS_LABEL, value: Constants.DATASET_LIST_DROPDOWN_TYPE_RSS_VALUE });
        this.datasetTypes.push({ label: Constants.DATASET_LIST_DROPDOWN_TYPE_TEXTO_PLANO_LABEL, value: Constants.DATASET_LIST_DROPDOWN_TYPE_TEXTO_PLANO_VALUE });
    }

    setSearchOptions() {
        this.searchOptions = [];
        this.searchOptions.push({ label: Constants.DATASET_LIST_DROPDOWN_SEARCH_FREE_SEARCH_VALUE_LABEL, value: this.datasetSearchOptionFreeSearch });
        this.searchOptions.push({ label: Constants.DATASET_LIST_DROPDOWN_SEARCH_TOPICS_LABEL, value: this.datasetSearchOptionTopics });
        this.searchOptions.push({ label: Constants.DATASET_LIST_DROPDOWN_SEARCH_ORGANIZATIONS_LABEL, value: this.datasetSearchOptionOrganizations });
        this.searchOptions.push({ label: Constants.DATASET_LIST_DROPDOWN_SEARCH_TAGS_LABEL, value: this.datasetSearchOptionTags });
        this.searchOptions.push({ label: Constants.DATASET_LIST_DROPDOWN_SEARCH_STATS_LABEL, value: this.datasetSearchOptionStats });
        this.searchOptions.push({ label: Constants.DATASET_LIST_DROPDOWN_SEARCH_HOMER_LABEL, value: this.datasetSearchOptionHomer });
        // this.searchOptions.push({ label: Constants.DATASET_LIST_DROPDOWN_SEARCH_SIU_LABEL, value: this.datasetSearchOptionSiu });
    }

    setLanguagesDropdown() {
        this.langsSelect = [];
        this.langsSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_LANG_ALL, value: undefined });
        this.langsSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_LANG_ES_VALUE, value: Constants.DATASET_LIST_DROPDOWN_LANG_ES_VALUE });
        this.langsSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_LANG_EN_VALUE, value: Constants.DATASET_LIST_DROPDOWN_LANG_EN_VALUE });
        this.langsSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_LANG_FR_LABEL, value: Constants.DATASET_LIST_DROPDOWN_LANG_FR_VALUE });
        this.langsSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_LANG_IT_LABEL, value: Constants.DATASET_LIST_DROPDOWN_LANG_IT_VALUE });
        this.langsSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_LANG_EL_LABEL, value: Constants.DATASET_LIST_DROPDOWN_LANG_EL_VALUE });
        this.langsSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_LANG_SL_LABEL, value: Constants.DATASET_LIST_DROPDOWN_LANG_SL_VALUE });
        this.langsSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_LANG_SR_LABEL, value: Constants.DATASET_LIST_DROPDOWN_LANG_SR_VALUE });
    }

    setGroupsDropdown() {
        this.groupSelect = [];
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_ALL.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_TERRITORIO.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_TERRITORIO.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_DEMOGRAFIA.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_DEMOGRAFIA.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_EDUCACION.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_EDUCACION.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_SALUD.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_SALUD.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_NIVELCALIDADVIDA.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_NIVELCALIDADVIDA.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_ANALISISSOCIALES.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_ANALISISSOCIALES.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_TRABAJOSALARIOS.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_TRABAJOSALARIOS.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_AGRICULTURA.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_AGRICULTURA.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_SERVICIOS.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_SERVICIOS.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_PRECIOS.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_PRECIOS.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_PIB.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_PIB.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_FINANCIERAS.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_FINANCIERAS.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_IDITIC.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_IDITIC.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_MEDIOAMBIENTE.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_MEDIOAMBIENTE.value });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_SECTORPUBLICO.label, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_SECTORPUBLICO.value });
    }

    setSubGroupsDropdown() {
        this.setSubGroupTerritorioDropdown();
        this.setSubGroupDemografiaDropdown();
        this.setSubGroupEducacionDropdown();
        this.setSubGroupSaludDropdown();
        this.setSubGroupNivelCalidadCondicionesVidaDropdown();
        this.setSubGroupNivelAnalisisSocialesJusticiaCulturaDeporteDropdown();
        this.setSubGroupTrabajoSalariosRelacionesLaboralesDropdown();
        this.setSubGroupAgriculturaIndustriaConstruccionDropdown();
        this.setSubGroupServiciosComercioTransporteTurismoDropdown();
        this.setSubGroupPreciosDropdown();
        this.setSubGroupPIBRentaComercioExteriorEmpresasDropdown();
        this.setSubGroupFinancierasMercantilesTributariasDropdown();
        this.setSubGroupIDITicDropdown();
        this.setSubGroupMedioAmbienteEnergiaDropdown();
        this.setSubGroupSectorPublicoEleccionesDropdown();
    }

    setSubGroupTerritorioDropdown() {
        this.subGroupTerritorioSelect = [];
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_ESPACIO_FISICO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_ESPACIO_FISICO.value });
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_USOS_SUELO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_USOS_SUELO.value });
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_NOMENCLATURAS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_NOMENCLATURAS.value });
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_INFRAESTRUCTURAS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_INFRAESTRUCTURAS.value });
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_MUNICIPIOS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_MUNICIPIOS.value });
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_COMARCAS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_COMARCAS.value });
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_ZONAS_SECTORIALES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_ZONAS_SECTORIALES.value });
    }

    setSubGroupDemografiaDropdown() {
        this.subGroupDemografiaSelect = [];
        this.subGroupDemografiaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupDemografiaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_CIFRAS_POBLACION.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_CIFRAS_POBLACION.value });
        this.subGroupDemografiaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_INDICADORES_DEMOGRAFICOS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_INDICADORES_DEMOGRAFICOS.value });
        this.subGroupDemografiaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_ESTUDIOS_DEMOGRAFICOS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_ESTUDIOS_DEMOGRAFICOS.value });
        this.subGroupDemografiaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_MIGRACIONES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_MIGRACIONES.value });
        this.subGroupDemografiaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_MOVIMIENTO_NATURAL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_MOVIMIENTO_NATURAL.value });
    }

    setSubGroupEducacionDropdown() {
        this.subGroupEducacionSelect = [];
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENSENANZA_NO_UNIVERSITARIA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENSENANZA_NO_UNIVERSITARIA.value });
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENSENANZA_UNIVERSITARIA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENSENANZA_UNIVERSITARIA.value });
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_GASTO_PUBLICO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_GASTO_PUBLICO.value });
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_BECAS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_BECAS.value });
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_TRANSICION.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_TRANSICION.value });
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENCUESTA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENCUESTA.value });
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_NIVEL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_NIVEL.value });
    }

    setSubGroupSaludDropdown() {
        this.subGroupSaludSelect = [];
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ESPERANZA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ESPERANZA.value });
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_POBLACION.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_POBLACION.value });
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_TARJETAS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_TARJETAS.value });
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ENCUESTA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ENCUESTA.value });
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_SECTORES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_SECTORES.value });
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_INFRAESTRUCTURA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_INFRAESTRUCTURA.value });
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DOTACION.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DOTACION.value });
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DISCAPACIDADES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DISCAPACIDADES.value });
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_MORBILIDAD.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_MORBILIDAD.value });
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DEFUNCIONES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DEFUNCIONES.value });
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ESTADISTICAS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ESTADISTICAS.value });
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_INTERRUPCION.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_INTERRUPCION.value });
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_OTRAS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_OTRAS.value });
    }
    
    setSubGroupNivelCalidadCondicionesVidaDropdown() {
        this.subGroupNivelCalidadVidaSelect = [];
        this.subGroupNivelCalidadVidaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupNivelCalidadVidaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_CONDICIONES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_CONDICIONES.value });
        this.subGroupNivelCalidadVidaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_PRESUPUESTOS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_PRESUPUESTOS.value });
        this.subGroupNivelCalidadVidaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_OTRAS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_OTRAS.value });
        this.subGroupNivelCalidadVidaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_INDICE.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_INDICE.value });
        this.subGroupNivelCalidadVidaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_PENSIONES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_PENSIONES.value });
        this.subGroupNivelCalidadVidaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_VIVIENDA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_VIVIENDA.value });
    }

    setSubGroupNivelAnalisisSocialesJusticiaCulturaDeporteDropdown() {
        this.subGroupAnalisisSocialesSelect = [];
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ANALISIS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ANALISIS.value });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_DEPENDENCIA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_DEPENDENCIA.value });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_COOPERACION.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_COOPERACION.value });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ENCUESTA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ENCUESTA.value });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_SECTOR.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_SECTOR.value });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ESTADISTICA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ESTADISTICA.value });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_JUSTICIA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_JUSTICIA.value });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_CULTURA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_CULTURA.value });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_DEPORTE.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_DEPORTE.value });
    }

    setSubGroupTrabajoSalariosRelacionesLaboralesDropdown() {
        this.subGroupTrabajoSalariosSelect = [];
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ENCUESTA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ENCUESTA.value });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PARO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PARO.value });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_AFILIADOS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_AFILIADOS.value });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_MOVIMIENTO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_MOVIMIENTO.value });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_RELACIONES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_RELACIONES.value });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_COSTES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_COSTES.value });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_SALARIOS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_SALARIOS.value });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PRESTACIONES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PRESTACIONES.value });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ACCIDENTES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ACCIDENTES.value });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ACTIVIDAD.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ACTIVIDAD.value });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PRINCIPALES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PRINCIPALES.value });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_HERRAMIENTAS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_HERRAMIENTAS.value });
    }

    setSubGroupAgriculturaIndustriaConstruccionDropdown() {
        this.subGroupAgriculturaSelect = [];
        this.subGroupAgriculturaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupAgriculturaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_AGRICULTURA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_AGRICULTURA.value });
        this.subGroupAgriculturaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_INDUSTRIA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_INDUSTRIA.value });
        this.subGroupAgriculturaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_CONSTRUCCION.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_CONSTRUCCION.value });
    }

    setSubGroupServiciosComercioTransporteTurismoDropdown() {
        this.subGroupServiciosSelect = [];
        this.subGroupServiciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupServiciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_ENCUESTAS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_ENCUESTAS.value });
        this.subGroupServiciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_COMERCIO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_COMERCIO.value });
        this.subGroupServiciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_TRANSPORTE.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_TRANSPORTE.value });
        this.subGroupServiciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_TURISMO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_TURISMO.value });
        this.subGroupServiciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_ACTIVIDAD.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_ACTIVIDAD.value });
    }

    setSubGroupPreciosDropdown() {
        this.subGroupPreciosSelect = [];
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_INDICE.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_INDICE.value });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_GASOLINAS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_GASOLINAS.value });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_VIVIENDA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_VIVIENDA.value });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_SUELO_URBANO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_SUELO_URBANO.value });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_SUELO_AGRARIO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_SUELO_AGRARIO.value });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_INDUSTRIA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_INDUSTRIA.value });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_HOSTELEROS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_HOSTELEROS.value });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_AGRARIOS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_AGRARIOS.value });
    }

    setSubGroupPIBRentaComercioExteriorEmpresasDropdown() {
        this.subGroupPIBSelect = [];
        this.subGroupPIBSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupPIBSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PIB_VALOR.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PIB_VALOR.value });
        this.subGroupPIBSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PIB_COMERCIO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PIB_COMERCIO.value });
        this.subGroupPIBSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PIB_EMPRESAS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PIB_EMPRESAS.value });
    }
    
    setSubGroupFinancierasMercantilesTributariasDropdown() {
        this.subGroupFinancierasSelect = [];
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ENTIDADES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ENTIDADES.value });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_EFECTOS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_EFECTOS.value });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_HIPOTECAS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_HIPOTECAS.value });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_SOCIEDADES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_SOCIEDADES.value });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ESTADOS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ESTADOS.value });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_SUSPENSIONES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_SUSPENSIONES.value });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ESTADISTICA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ESTADISTICA.value });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_INFORMACION.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_INFORMACION.value });
    }

    setSubGroupIDITicDropdown() {
        this.subGroupIDITicSelect = [];
        this.subGroupIDITicSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupIDITicSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_IDITIC_INVESTIGACION.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_IDITIC_INVESTIGACION.value });
        this.subGroupIDITicSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_IDITIC_TECNOLOGIAS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_IDITIC_TECNOLOGIAS.value });
    }

    setSubGroupMedioAmbienteEnergiaDropdown() {
        this.subGroupMedioAmbienteSelect = [];
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_SECTORES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_SECTORES.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_AGUA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_AGUA.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CALIDAD_AIRE.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CALIDAD_AIRE.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CAMBIO_CLIMATICO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CAMBIO_CLIMATICO.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CLIMA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CLIMA.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_GASTO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_GASTO.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_HOGARES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_HOGARES.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_MEDIO_AMBIENTE.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_MEDIO_AMBIENTE.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_NATURALEZA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_NATURALEZA.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_PREVENCION.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_PREVENCION.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_RESIDUOS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_RESIDUOS.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_RIESGOS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_RIESGOS.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_SUELOS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_SUELOS.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_TRIBUTOS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_TRIBUTOS.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_UTILIZACION.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_UTILIZACION.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_DESARROLLO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_DESARROLLO.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_DICCIONARIO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_DICCIONARIO.value });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_ENERGIA.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_ENERGIA.value });
    }

    setSubGroupSectorPublicoEleccionesDropdown() {
        this.subGroupSectorPublicoSelect = [];
        this.subGroupSectorPublicoSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL.value });
        this.subGroupSectorPublicoSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_EMPLEO.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_EMPLEO.value });
        this.subGroupSectorPublicoSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_PRESUPUESTOS.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_PRESUPUESTOS.value });
        this.subGroupSectorPublicoSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_ACTIVIDADES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_ACTIVIDADES.value });
        this.subGroupSectorPublicoSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_ELECCIONES.label, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_ELECCIONES.value });
    }

    setInfoTables() {
        this.datasetsService.getNewestDataset().subscribe(datasets => {
            try {
                this.newestDatasets = JSON.parse(datasets).result.results;
            } catch (error) {
                console.error('Error: setInfoTables() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });
        this.datasetsService.getDownloadedDataset().subscribe(datasets => {
            try {
                this.downloadedDatasets = JSON.parse(datasets).result.results;
            } catch (error) {
                console.error('Error: setInfoTables() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });
    }

    searchDatasetsByText() {
        this.datasets = [];
        if(this.textSearch != undefined){
            this.location.go('/' + this.routerLinkDataCatalog + '?texto=' + this.textSearch);
            this.getDatasetsBySearch(null, null, this.textSearch);
        } else{
            this.location.go('/' + this.routerLinkDataCatalog);
            this.getDatasetsBySearch(null, null, "");
        } 
    }

    searchDatasetsetByOrg() {
        this.datasets = [];
        this.getDatasetsByOrg(null, null, this.selectedOrg, this.selectedType);
    }

    searchDatasetsByHomer(searchParam: string) {
        this.datasets = [];
        this.searchHomerValue = searchParam;
        this.getDatasetsByHomer(null, null);
    }

    setDatasetsStats() {
        this.datasetsService.getDatasetsNumber().subscribe(datasets => {
            try {
                this.datasetCount = [];
                let totalNumDatasets = '';
                totalNumDatasets = JSON.parse(datasets).result.count + '';
                while (totalNumDatasets.length < 8) totalNumDatasets = 'S' + totalNumDatasets;
                for (var i = 0; i < totalNumDatasets.length; i++) {
                    if (totalNumDatasets[i] == 'S') {
                        this.datasetCount.push({ label: 'slim', value: '0' });
                    } else {
                        this.datasetCount.push({ label: 'normal', value: totalNumDatasets[i] });
                    }
                }
                return this.datasetCount;
            } catch (error) {
                console.error('Error: setDatasetsStats() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });

        this.datasetsService.getResourcesNumber().subscribe(resources => {
            try {
                this.resourceCount = [];
                let totalNumResources = '';
                totalNumResources = JSON.parse(resources).result.count + '';
                while (totalNumResources.length < 8) totalNumResources = 'S' + totalNumResources;
                for (var i = 0; i < totalNumResources.length; i++) {
                    if (totalNumResources[i] == 'S') {
                        this.resourceCount.push({ label: 'slim', value: '0' });
                    } else {
                        this.resourceCount.push({ label: 'normal', value: totalNumResources[i] });
                    }
                }
                return this.resourceCount;
            } catch (error) {
                console.error('Error: setDatasetsStats() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });
    }

    filterTagsMultiple(event) {
        let query = event.query;
        this.datasetsService.getTags(query).subscribe(tags => {
            try {
                this.filteredTagsMultiple = [];
                for (let i = 0; i < JSON.parse(tags).result.length; i++) {
                    let tag = JSON.parse(tags).result[i];
                    if (tag.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                        this.filteredTagsMultiple.push({ name: tag, value: tag });
                    }
                }
            } catch (error) {
                console.error('Error filterTagsMultiple() - datasets-list.component.ts');
                this.errorTitle = this.datasetListErrorTitle;
                this.errorMessage = this.datasetListErrorMessage;
            }
        });
    }

    onResize(){
        this.hideLastUpdateColumn = false;
        this.hideAccessNumberColumn = false;
        if(window.innerWidth<768){
            this.hideAccessNumberColumn = true;
        }else{
            this.hideAccessNumberColumn = false;
        }
        if(window.innerWidth<576){
            this.hideLastUpdateColumn = true;
        }else{
            this.hideLastUpdateColumn = false;
        }
    }

    getOpenedMenu(){
        this.utilsService.openedMenuChange.subscribe(value => {
			this.openedMenu = value;
		});
    }
}