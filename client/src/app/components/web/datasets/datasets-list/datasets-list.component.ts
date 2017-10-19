import { OrganizationsService } from './../../../../services/web/organizations.service';
import { Organization } from './../../../../models/Organization';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem, DropdownModule } from 'primeng/primeng';
import { DatasetsService } from '../../../../services/web/datasets.service';
import { TopicsService } from '../../../../services/web/topics.service';
import { TopicsListComponent } from '../../topics/topics-list/topics-list.component';
import { Dataset } from '../../../../models/Dataset';
import { DatasetHomer } from '../../../../models/DatasetHomer';
import { Topic } from '../../../../models/Topic';
import { Constants } from '../../../../app.constants';

@Component({
    selector: 'app-datasets-list',
    templateUrl: './datasets-list.component.html',
    styleUrls: ['./datasets-list.component.css']
})

export class DatasetsListComponent implements OnInit {

    selectedTopic: string;
    selectedOrg: string;
    selectedType: string;
    selectedGroup: string;
    selectedLang: string;
    selectedSearchOption: string;
    selectedSubGroup: string;
    sort: string;
    sortHomer: string;
    datasets: Dataset[];
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
    searchValue: string = '';
    textSearch: string;
    textSearchHomer: string;
    searchHomerValue: string = '';
    tags: string[];
    filteredTagsMultiple: any[];

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
    //Dynamic URL build parameters
	routerLinkPageNotFound: string;
    routerLinkDataCatalog: string;
    routerLinkDataCatalogDataset: string;
    routerLinkDataCatalogTopics: string;
    routerLinkDataCatalogOrganizations: string;
    routerLinkDataCatalogTags: string;
    routerLinkDataCatalogDatasetHomer: string;
    //Pagination Params
    pages: number [];
    actualPage:number;
    pagesShow: string[];
    pageFirst: number;
    pageLast: number;
    //Error Params
    errorTitle: string;
    errorMessage: string;

    constructor(private datasetsService: DatasetsService, private topicsService: TopicsService
        , private orgsService: OrganizationsService, private router: Router
        , private location: Location, private changeDetectorRef: ChangeDetectorRef
        , private activatedRoute: ActivatedRoute) {
    this.pageRows = Constants.DATASET_LIST_ROWS_PER_PAGE;
    this.routerLinkDataCatalog = Constants.ROUTER_LINK_DATA_CATALOG;
    this.routerLinkDataCatalogDataset = Constants.ROUTER_LINK_DATA_CATALOG_DATASET;
    this.routerLinkDataCatalogTopics = Constants.ROUTER_LINK_DATA_CATALOG_TOPICS;
    this.routerLinkDataCatalogOrganizations = Constants.ROUTER_LINK_DATA_CATALOG_ORGANIZATIONS;
    this.routerLinkDataCatalogTags = Constants.ROUTER_LINK_DATA_CATALOG_TAGS;
    this.datasetSearchOptionFreeSearch = Constants.DATASET_LIST_SEARCH_OPTION_FREE_SEARCH;
    this.datasetSearchOptionTopics = Constants.DATASET_LIST_SEARCH_OPTION_TOPICS;
    this.datasetSearchOptionOrganizations = Constants.DATASET_LIST_SEARCH_OPTION_ORGANIZATIONS;
    this.datasetSearchOptionTags = Constants.DATASET_LIST_SEARCH_OPTION_TAGS;
    this.datasetSearchOptionStats = Constants.DATASET_LIST_SEARCH_OPTION_STATS;
    this.datasetSearchOptionHomer = Constants.DATASET_LIST_SEARCH_OPTION_HOMER;
    this.routerLinkDataCatalogDatasetHomer = Constants.ROUTER_LINK_DATA_CATALOG_HOMER_DATASET;
    this.emptyMessage = Constants.DATASET_LIST_EMPTY;
    if (this.selectedSearchOption === undefined) {
        this.selectedSearchOption = this.datasetSearchOptionFreeSearch;
    }
    this.groupsOptionTerritorio = Constants.DATASET_LIST_DROPDOWN_GROUPS_TERRITORIO;
    this.groupsOptionDemografia = Constants.DATASET_LIST_DROPDOWN_GROUPS_DEMOGRAFIA;
    this.groupsOptionEducacion = Constants.DATASET_LIST_DROPDOWN_GROUPS_EDUCACION;
    this.groupsOptionSalud = Constants.DATASET_LIST_DROPDOWN_GROUPS_SALUD;
    this.groupsOptionNivelCalidadVida = Constants.DATASET_LIST_DROPDOWN_GROUPS_NIVELCALIDADVIDA;
    this.groupsOptionAnalisisSociales = Constants.DATASET_LIST_DROPDOWN_GROUPS_ANALISISSOCIALES;
    this.groupsOptionTrabajoSalarios = Constants.DATASET_LIST_DROPDOWN_GROUPS_TRABAJOSALARIOS;
    this.groupsOptionAgricultura = Constants.DATASET_LIST_DROPDOWN_GROUPS_AGRICULTURA;
    this.groupsOptionServicios = Constants.DATASET_LIST_DROPDOWN_GROUPS_SERVICIOS;
    this.groupsOptionPrecios = Constants.DATASET_LIST_DROPDOWN_GROUPS_PRECIOS;
    this.groupsOptionPib = Constants.DATASET_LIST_DROPDOWN_GROUPS_PIB;
    this.groupsOptionFinancieras = Constants.DATASET_LIST_DROPDOWN_GROUPS_FINANCIERAS;
    this.groupsOptionIDITic = Constants.DATASET_LIST_DROPDOWN_GROUPS_IDITIC;
    this.groupsOptionMedioAmbiente = Constants.DATASET_LIST_DROPDOWN_GROUPS_MEDIOAMBIENTE;
    this.groupsOptionSectorPublico = Constants.DATASET_LIST_DROPDOWN_GROUPS_SECTORPUBLICO; 
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            try {
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
            } catch (error) {
                console.error("Error: ngOnInit() queryParams - datasets-list.component.ts");
            }
        });

        this.activatedRoute.params.subscribe(params => {
            try {
                this.selectedTopic = params[Constants.ROUTER_LINK_DATA_PARAM_TOPIC_NAME];
                this.selectedOrg = params[Constants.ROUTER_LINK_DATA_PARAM_ORGANIZATION_NAME];
            } catch (error) {
                console.error("Error: ngOnInit() params - datasets-list.component.ts");
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
        
    }

    loadDatasets() {
        this.datasets = [];
        if (this.textSearch != undefined) {
            this.searchDatasetsByText(this.textSearch);
            this.searchValue = this.textSearch;
        } else if (this.selectedTopic) {
            this.getDatasetsByTopic(this.selectedTopic, null, null, this.selectedType);
            this.selectedSearchOption = this.datasetSearchOptionTopics;
        } else if (this.selectedOrg) {
            this.getDatasetsByOrg(null, null, this.selectedOrg, this.selectedType);
            this.selectedSearchOption = this.datasetSearchOptionOrganizations;
        } else if(this.tags){
            this.getDatasetsByTags(null,null);
            this.selectedSearchOption = this.datasetSearchOptionTags;
        } else if(this.selectedSearchOption == this.datasetSearchOptionHomer){
            this.getDatasetsByHomer(null,null);
        } else if(this.textSearchHomer){
            this.selectedSearchOption = this.datasetSearchOptionHomer;
            this.searchHomerValue = this.textSearchHomer;
            this.getDatasetsByHomer(null,null);
        } else {
            this.getDatasets(null, null);
        }
    }

    setPagination(actual: number, total: number){
        this.actualPage = actual;
        this.pageFirst = 0;
        this.pageLast = Math.ceil(+total/+this.pageRows);        
        this.pages = [];
        this.pagesShow = [];
        if(this.pageLast == 0){
            this.pagesShow.push('-');   
        }
        for (var index = 0; index < this.pageLast; index++) {
            this.pages.push(+index+1);   
        }
        if (this.actualPage<4) {
            for (var index = 0; index < 5; index++) {
                if(this.pages[index]){
                    this.pagesShow.push(String (+this.pages[index]));
                }
            }
        } else if (this.actualPage >= (135)) {
            for (var index = (+this.pageLast-5); index < this.pageLast; index++) {
                if(this.pages[index]){
                    this.pagesShow.push(String (+this.pages[index]));
                }
            }
        } else{
            for (var index = (+actual-2); index <= (+this.actualPage+2); index++) {
                if(this.pages[index]){
                    this.pagesShow.push(String (+this.pages[index]));
                }
            }
        }
    }

    paginate(page:number) {
        --page;
        if (this.textSearch != undefined) {
            this.searchDatasetsByText(this.textSearch);
            this.searchValue = this.textSearch;
        } else if (this.selectedTopic) {
            this.getDatasetsByTopic(this.selectedTopic, page, this.pageRows, this.selectedType);
            this.selectedSearchOption = this.datasetSearchOptionTopics;
        } else if (this.selectedOrg) {
            this.getDatasetsByOrg(page, this.pageRows, this.selectedOrg, this.selectedType);
            this.selectedSearchOption = this.datasetSearchOptionOrganizations;
        } else if(this.tags){
            this.getDatasetsByTags(page, this.pageRows);
            this.selectedSearchOption = this.datasetSearchOptionTags;
        }else if(this.selectedSearchOption == this.datasetSearchOptionHomer){
            this.getDatasetsByHomer(page, this.pageRows);
        } else if(this.textSearchHomer){
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
            if (this.selectedType) {
                this.router.navigate(['/' + this.routerLinkDataCatalogTopics + '/' + this.selectedTopic], { queryParams: { tipo: this.selectedType } });
                this.getDatasetsByTopic(this.selectedTopic, null, null, this.selectedType);
            } else {
                this.router.navigate(['/' + this.routerLinkDataCatalogTopics + '/' + this.selectedTopic]);
                this.getDatasetsByTopic(this.selectedTopic, null, null, null);
            }
        } else if (this.selectedOrg) {
            if (this.selectedType) {
                this.router.navigate(['/' + this.routerLinkDataCatalogOrganizations + '/' + this.selectedOrg], { queryParams: { tipo: this.selectedType } });
                this.getDatasetsByOrg(null, null, this.selectedOrg, this.selectedType);
            } else {
                this.router.navigate(['/' + this.routerLinkDataCatalogOrganizations + '/' + this.selectedOrg]);
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

    resetSearch() {
        this.selectedTopic = undefined;
        this.selectedOrg = undefined;
        this.selectedType = undefined;
        this.selectedGroup = undefined;
        this.selectedSubGroup = undefined;
        this.searchValue = '';
        this.tags = undefined;
        this.textSearch = undefined;
        this.loadDatasets();
        this.location.go('/' + this.routerLinkDataCatalog);
    }

    resetSubGroupSearch(){
        this.selectedSubGroup = undefined;
    }

    showDataset(dataset: Dataset) {
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
                this.setPagination(pageNumber,this.numDatasets);
            } catch (error) {
                console.error("Error: getDatasets() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
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
                this.setPagination(pageNumber,this.numDatasets);
            } catch (error) {
                console.error("Error: getDatasetsBySearch() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
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
                this.setPagination(pageNumber,this.numDatasets);
            } catch (error) {
                console.error("Error: getDatasetsBySearch() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
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
                this.setPagination(pageNumber,this.numDatasets);
            } catch (error) {
                console.error("Error: getDatasetsByOrg() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
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
                this.setPagination(pageNumber,this.numDatasets);
            } catch (error) {
                console.error("Error: getDatasetsByTags() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
        
    }

    getDatasetsByHomer(page: number, rows: number): void {
        this.datasetsHomer = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsHomer(this.sortHomer, pageNumber, rowsNumber, this.searchHomerValue, this.selectedLang).subscribe(datasetsHomer => {
            try {
                this.datasetsHomer = JSON.parse(datasetsHomer).response.docs;
                this.numDatasetsHomer = JSON.parse(datasetsHomer).response.numFound;
                this.setPagination(pageNumber, this.numDatasetsHomer);
            } catch (error) {
                console.error("Error: getDatasetsByHomer() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
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
                console.error("Error: setTopicsDropdown() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
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
                console.error("Error: setOrgsDropdown() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error al cargar la lista, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
    }

    getSelectedTopic() {
        if (this.topicsService.getTopic() === undefined) {
        } else {
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
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_ALL, value: undefined });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_TERRITORIO, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_TERRITORIO });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_DEMOGRAFIA, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_DEMOGRAFIA });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_EDUCACION, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_EDUCACION });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_SALUD, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_SALUD });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_NIVELCALIDADVIDA, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_NIVELCALIDADVIDA });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_ANALISISSOCIALES, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_ANALISISSOCIALES });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_TRABAJOSALARIOS, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_TRABAJOSALARIOS });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_AGRICULTURA, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_AGRICULTURA });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_SERVICIOS, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_SERVICIOS });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_PRECIOS, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_PRECIOS });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_PIB, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_PIB });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_FINANCIERAS, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_FINANCIERAS });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_IDITIC, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_IDITIC });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_MEDIOAMBIENTE, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_MEDIOAMBIENTE });
        this.groupSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_GROUPS_SECTORPUBLICO, value: Constants.DATASET_LIST_DROPDOWN_GROUPS_SECTORPUBLICO });   
    }

    setSubGroupsDropdown(){
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
    
    setSubGroupTerritorioDropdown(){
        this.subGroupTerritorioSelect = [];
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_ESPACIO_FISICO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_ESPACIO_FISICO });
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_USOS_SUELO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_USOS_SUELO });
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_NOMENCLATURAS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_NOMENCLATURAS });
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_INFRAESTRUCTURAS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_INFRAESTRUCTURAS });
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_MUNICIPIOS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_MUNICIPIOS });
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_COMARCAS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_COMARCAS });
        this.subGroupTerritorioSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_ZONAS_SECTORIALES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_ZONAS_SECTORIALES });
    }

    setSubGroupDemografiaDropdown(){
        this.subGroupDemografiaSelect = [];
        this.subGroupDemografiaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupDemografiaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_CIFRAS_POBLACION, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_CIFRAS_POBLACION });
        this.subGroupDemografiaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_INDICADORES_DEMOGRAFICOS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_INDICADORES_DEMOGRAFICOS });
        this.subGroupDemografiaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_ESTUDIOS_DEMOGRAFICOS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_ESTUDIOS_DEMOGRAFICOS });
        this.subGroupDemografiaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_MIGRACIONES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_MIGRACIONES });
        this.subGroupDemografiaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_MOVIMIENTO_NATURAL, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_MOVIMIENTO_NATURAL });

    }

    setSubGroupEducacionDropdown(){
        this.subGroupEducacionSelect = [];
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENSENANZA_NO_UNIVERSITARIA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENSENANZA_NO_UNIVERSITARIA});
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENSENANZA_UNIVERSITARIA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENSENANZA_UNIVERSITARIA});
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_GASTO_PUBLICO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_GASTO_PUBLICO});
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_BECAS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_BECAS});
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_TRANSICION, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_TRANSICION});
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENCUESTA , value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENCUESTA });
        this.subGroupEducacionSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_NIVEL , value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_NIVEL });

    }
    setSubGroupSaludDropdown(){   
        this.subGroupSaludSelect = [];
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ESPERANZA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ESPERANZA});
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_POBLACION, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_POBLACION});
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_TARJETAS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_TARJETAS});
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ENCUESTA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ENCUESTA});
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_SECTORES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_SECTORES});
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_INFRAESTRUCTURA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_INFRAESTRUCTURA});
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DOTACION, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DOTACION});
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DISCAPACIDADES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DISCAPACIDADES});
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_MORBILIDAD, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_MORBILIDAD});
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DEFUNCIONES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DEFUNCIONES});
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ESTADISTICAS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ESTADISTICAS});
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_INTERRUPCION, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_INTERRUPCION});
        this.subGroupSaludSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_OTRAS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_OTRAS});

    }
    setSubGroupNivelCalidadCondicionesVidaDropdown(){   
        this.subGroupNivelCalidadVidaSelect = [];
        this.subGroupNivelCalidadVidaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupNivelCalidadVidaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_CONDICIONES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_CONDICIONES});
        this.subGroupNivelCalidadVidaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_PRESUPUESTOS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_PRESUPUESTOS});
        this.subGroupNivelCalidadVidaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_OTRAS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_OTRAS});
        this.subGroupNivelCalidadVidaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_INDICE, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_INDICE});
        this.subGroupNivelCalidadVidaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_PENSIONES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_PENSIONES});
        this.subGroupNivelCalidadVidaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_VIVIENDA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_VIVIENDA});

    }
    setSubGroupNivelAnalisisSocialesJusticiaCulturaDeporteDropdown(){  
        this.subGroupAnalisisSocialesSelect = [];
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ANALISIS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ANALISIS });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_DEPENDENCIA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_DEPENDENCIA });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_COOPERACION, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_COOPERACION });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ENCUESTA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ENCUESTA });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_SECTOR, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_SECTOR });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ESTADISTICA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ESTADISTICA });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_JUSTICIA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_JUSTICIA });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_CULTURA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_CULTURA });
        this.subGroupAnalisisSocialesSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_DEPORTE, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_DEPORTE });


    }
    setSubGroupTrabajoSalariosRelacionesLaboralesDropdown(){  
        this.subGroupTrabajoSalariosSelect = [];
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ENCUESTA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ENCUESTA });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PARO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PARO });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_AFILIADOS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_AFILIADOS });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_MOVIMIENTO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_MOVIMIENTO });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_RELACIONES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_RELACIONES });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_COSTES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_COSTES });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_SALARIOS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_SALARIOS });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PRESTACIONES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PRESTACIONES });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ACCIDENTES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ACCIDENTES });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ACTIVIDAD, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ACTIVIDAD });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PRINCIPALES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PRINCIPALES });
        this.subGroupTrabajoSalariosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_HERRAMIENTAS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_HERRAMIENTAS });
  
    }
    setSubGroupAgriculturaIndustriaConstruccionDropdown(){   
        this.subGroupAgriculturaSelect = [];
        this.subGroupAgriculturaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupAgriculturaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_AGRICULTURA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_AGRICULTURA });
        this.subGroupAgriculturaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_INDUSTRIA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_INDUSTRIA });
        this.subGroupAgriculturaSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_CONSTRUCCION, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_CONSTRUCCION });

    }
    setSubGroupServiciosComercioTransporteTurismoDropdown(){   
        this.subGroupServiciosSelect = [];
        this.subGroupServiciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupServiciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_ENCUESTAS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_ENCUESTAS });
        this.subGroupServiciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_COMERCIO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_COMERCIO });
        this.subGroupServiciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_TRANSPORTE, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_TRANSPORTE });
        this.subGroupServiciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_TURISMO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_TURISMO });
        this.subGroupServiciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_ACTIVIDAD, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_ACTIVIDAD });

    }
    setSubGroupPreciosDropdown(){   
        this.subGroupPreciosSelect = [];
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_INDICE, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_INDICE });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_GASOLINAS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_GASOLINAS });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_VIVIENDA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_VIVIENDA });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_SUELO_URBANO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_SUELO_URBANO });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_SUELO_AGRARIO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_SUELO_AGRARIO });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_INDUSTRIA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_INDUSTRIA });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_HOSTELEROS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_HOSTELEROS });
        this.subGroupPreciosSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_AGRARIOS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_AGRARIOS });

    }
    setSubGroupPIBRentaComercioExteriorEmpresasDropdown(){  
        this.subGroupPIBSelect = [];
        this.subGroupPIBSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupPIBSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PIB_VALOR, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PIB_VALOR });
        this.subGroupPIBSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PIB_COMERCIO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PIB_COMERCIO });
        this.subGroupPIBSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PIB_EMPRESAS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_PIB_EMPRESAS });
        

    }
    setSubGroupFinancierasMercantilesTributariasDropdown(){   
        this.subGroupFinancierasSelect = [];
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ENTIDADES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ENTIDADES });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_EFECTOS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_EFECTOS });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_HIPOTECAS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_HIPOTECAS });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_SOCIEDADES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_SOCIEDADES });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ESTADOS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ESTADOS });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_SUSPENSIONES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_SUSPENSIONES });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ESTADISTICA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ESTADISTICA });
        this.subGroupFinancierasSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_INFORMACION, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_INFORMACION });

    }
    
    setSubGroupIDITicDropdown(){   
        this.subGroupIDITicSelect = [];
        this.subGroupIDITicSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupIDITicSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_IDITIC_INVESTIGACION, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_IDITIC_INVESTIGACION });
        this.subGroupIDITicSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_IDITIC_TECNOLOGIAS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_IDITIC_TECNOLOGIAS });
    }
    
    setSubGroupMedioAmbienteEnergiaDropdown(){  
        this.subGroupMedioAmbienteSelect = [];
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_SECTORES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_SECTORES });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_AGUA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_AGUA });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CALIDAD_AIRE, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CALIDAD_AIRE });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CAMBIO_CLIMATICO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CAMBIO_CLIMATICO });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CLIMA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CLIMA });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_GASTO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_GASTO });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_HOGARES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_HOGARES });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_MEDIO_AMBIENTE, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_MEDIO_AMBIENTE });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_NATURALEZA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_NATURALEZA });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_PREVENCION, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_PREVENCION });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_RESIDUOS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_RESIDUOS });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_RIESGOS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_RIESGOS });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_SUELOS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_SUELOS });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_TRIBUTOS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_TRIBUTOS });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_UTILIZACION, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_UTILIZACION });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_DESARROLLO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_DESARROLLO });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_DICCIONARIO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_DICCIONARIO });
        this.subGroupMedioAmbienteSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_ENERGIA, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_ENERGIA });
         
    }
    
    setSubGroupSectorPublicoEleccionesDropdown(){   
        this.subGroupSectorPublicoSelect = [];
        this.subGroupSectorPublicoSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUPS_ALL, value: undefined });
        this.subGroupSectorPublicoSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_EMPLEO, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_EMPLEO });
        this.subGroupSectorPublicoSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_PRESUPUESTOS, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_PRESUPUESTOS });
        this.subGroupSectorPublicoSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_ACTIVIDADES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_ACTIVIDADES });
        this.subGroupSectorPublicoSelect.push({ label: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_ELECCIONES, value: Constants.DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_ELECCIONES });
    }

    setInfoTables() {
        this.datasetsService.getNewestDataset().subscribe(datasets => {
            try {
                this.newestDatasets = JSON.parse(datasets).result.results;
            } catch (error) {
                console.error("Error: setInfoTables() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error al obtener los datasets recientes, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
        this.datasetsService.getDownloadedDataset().subscribe(datasets => {
            try {
                this.downloadedDatasets = JSON.parse(datasets).result.results;
            } catch (error) {
                console.error("Error: setInfoTables() - datasets-list.component.ts");
                this.errorTitle="Error";
                this.errorMessage="Ha ocurrido un error en la carga de Datsets";
            }
        });
    }

    searchDatasetsByText(searchParam: string) {
        this.datasets = [];
        this.getDatasetsBySearch(null, null, searchParam);
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
                    if(totalNumDatasets[i] == 'S'){
                        this.datasetCount.push({ label: 'slim', value: '0' });
                    }else{
                        this.datasetCount.push({ label: 'normal', value: totalNumDatasets[i]});
                    }
                }
                return this.datasetCount;
            } catch (error) {
                console.error("Error: setDatasetsStats() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error al cargar los datasets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
        this.datasetsService.getResourcesNumber().subscribe(resources => {
            try {
                this.resourceCount = [];
                let totalNumResources = '';            
                totalNumResources = JSON.parse(resources).result.count + '';
                while (totalNumResources.length < 8) totalNumResources = 'S' + totalNumResources;
                for (var i = 0; i < totalNumResources.length; i++) {
                    if(totalNumResources[i] == 'S'){
                        this.resourceCount.push({ label: 'slim', value: '0' });
                    }else{
                        this.resourceCount.push({ label: 'normal', value: totalNumResources[i]});
                    }
                }
                return this.resourceCount;
            } catch (error) {
                console.error("Error: setDatasetsStats() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error al cargar los datasets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
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
                console.log("Error filterTagsMultiple() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error con el filtrado por etiquetas, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
    }
}