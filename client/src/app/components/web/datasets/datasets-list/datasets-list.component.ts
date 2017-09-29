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
    totalResources: string;
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
    this.routerLinkDataCatalogDatasetHomer = Constants.ROUTER_LINK_DATA_CATALOG_HOMER_DETAIL;
    if (this.selectedSearchOption === undefined) {
        this.selectedSearchOption = this.datasetSearchOptionFreeSearch;
    } 
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
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
            
        });

        this.activatedRoute.params.subscribe(params => {
            this.selectedTopic = params[Constants.ROUTER_LINK_DATA_PARAM_TOPIC_NAME];
            this.selectedOrg = params[Constants.ROUTER_LINK_DATA_PARAM_ORGANIZATION_NAME];
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
        } if(this.tags){
            this.getDatasetsByTags(null,null);
            this.selectedSearchOption = this.datasetSearchOptionTags;
        }else if(this.selectedSearchOption == this.datasetSearchOptionHomer){
            this.getDatasetsByHomer(null,null);
        } else if(this.textSearchHomer){
            this.selectedSearchOption = this.datasetSearchOptionHomer;
            this.searchHomerValue = this.textSearchHomer;
            this.getDatasetsByHomer(null,null);

        } else {
            this.getDatasets(null, null);
        }
        
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
            console.log('TRUE ' + this.tags.length);
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
        this.searchValue = '';
        this.tags = undefined;
        this.textSearch = undefined;
        this.loadDatasets();
        this.location.go('/' + this.routerLinkDataCatalog);
    }

    showDataset(dataset: Dataset) {
        this.datasetsService.setDataset(dataset);
    }

    addDataset() {
        this.dataset = new Dataset();
        this.datasetsService.setDataset(this.dataset);
    }

    setOrder(event) {
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

    paginate(event) {
        if (this.selectedTopic === undefined) {
            this.getDatasets(event.page, event.rows);
        } else {
            this.getDatasetsByTopic(this.selectedTopic, event.page, event.rows, this.selectedType);
        }
        document.body.scrollTop = 0;
    }

    paginateHomer(event) {
        this.getDatasetsByHomer(event.page, event.rows);
        document.body.scrollTop = 0;
    }

    getDatasets(page: number, rows: number): void {
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasets(this.sort, pageNumber, rowsNumber, this.selectedType).subscribe(datasets => {
            this.datasets = JSON.parse(datasets).result.results;
            this.numDatasets = JSON.parse(datasets).result.count;
        });
    }

    getDatasetsByTopic(topic: string, page: number, rows: number, type: string): void {
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsByTopic(topic, this.sort, pageNumber, rowsNumber, type).subscribe(datasets => {
            this.datasets = JSON.parse(datasets).result.results;
            this.numDatasets = JSON.parse(datasets).result.count;
        });
    }

    getDatasetsBySearch(page: number, rows: number, searchParam: string): void {
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsByText(this.sort, pageNumber, rowsNumber, searchParam).subscribe(datasets => {
            this.datasets = JSON.parse(datasets).result.results;
            this.numDatasets = JSON.parse(datasets).result.count;
        });
    }

    getDatasetsByOrg(page: number, rows: number, org: string, type: string): void {
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsByOrganization(org, this.sort, pageNumber, rowsNumber, type).subscribe(datasets => {
            this.datasets = JSON.parse(datasets).result.results;
            this.numDatasets = JSON.parse(datasets).result.count;
        });
    }

    getDatasetsByTags(page: number, rows: number): void {
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsBytags(this.sort, pageNumber, rowsNumber, this.tags).subscribe(datasets => {
            this.datasets = JSON.parse(datasets).result.results;
            this.numDatasets = JSON.parse(datasets).result.count;
        });
        
    }

    getDatasetsByHomer(page: number, rows: number): void {
        this.datasetsHomer = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsHomer(this.sortHomer, pageNumber, rowsNumber, this.searchHomerValue, this.selectedLang).subscribe(datasetsHomer => {
            this.datasetsHomer = JSON.parse(datasetsHomer).response.docs;
            this.numDatasetsHomer = JSON.parse(datasetsHomer).response.numFound;
        });
    }

    setTopicsDropdown() {
        this.getSelectedTopic();
        this.topicsSelect = [];
        this.topicsSelect.push({ label: 'Todos los temas', value: undefined });
        this.topicsService.getTopics().subscribe(topics => {
            this.topics = JSON.parse(topics).result;
            for (let top of this.topics) {
                this.topicsSelect.push({ label: top.title, value: top.name });
            }
        });
    }
    setOrgsDropdown() {
        this.orgsSelect = [];
        this.orgsSelect.push({ label: 'Todas las organizaciones', value: undefined });
        this.orgsService.getOrganizations().subscribe(orgs => {
            this.orgs = JSON.parse(orgs).result;
            for (let org of this.orgs) {
                this.orgsSelect.push({ label: org.title, value: org.name });
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
        this.datasetTypes.push({ label: 'Todos los tipos', value: undefined });
        this.datasetTypes.push({ label: 'Calendario', value: 'calendario' });
        this.datasetTypes.push({ label: 'Fotos', value: 'fotos' });
        this.datasetTypes.push({ label: 'Hojas de Calculo', value: 'hojas-de-calculo' });
        this.datasetTypes.push({ label: 'Mapas', value: 'mapas' });
        this.datasetTypes.push({ label: 'Recursos Educativos', value: 'recursos-educativos' });
        this.datasetTypes.push({ label: 'Recursos Web', value: 'recursos-web' });
        this.datasetTypes.push({ label: 'RSS', value: 'rss' });
        this.datasetTypes.push({ label: 'Texto plano', value: 'texto-plano' });
    }

    setSearchOptions() {
        this.searchOptions = [];
        this.searchOptions.push({ label: 'Búsqueda libre', value: this.datasetSearchOptionFreeSearch });
        this.searchOptions.push({ label: 'Tema y tipo', value: this.datasetSearchOptionTopics });
        this.searchOptions.push({ label: 'Organización y tipo', value: this.datasetSearchOptionOrganizations });
        this.searchOptions.push({ label: 'Etiquetas', value: this.datasetSearchOptionTags });
        this.searchOptions.push({ label: 'Información estadística', value: this.datasetSearchOptionStats });
        this.searchOptions.push({ label: 'Buscador Homer', value: this.datasetSearchOptionHomer });
    }

    setLanguagesDropdown() {
        this.langsSelect = [];
        this.langsSelect.push({ label: 'Todos los idiomas', value: undefined });
        this.langsSelect.push({ label: 'Español', value: 'es' });
        this.langsSelect.push({ label: 'English', value: 'en' });
        this.langsSelect.push({ label: 'Français', value: 'fr' });
        this.langsSelect.push({ label: 'Italiano', value: 'it' });
        this.langsSelect.push({ label: 'ελληνικά', value: 'el' });
        this.langsSelect.push({ label: 'Slovenščina', value: 'sl' });
        this.langsSelect.push({ label: 'Српски', value: 'sr' });
    }

    setGroupsDropdown() {
        this.groupSelect = [];
        this.groupSelect.push({ label: 'Todos los grupos', value: undefined });
        this.groupSelect.push({ label: 'Territorio', value: 'Territorio' });
        this.groupSelect.push({ label: 'Demografía y Población', value: 'Demografía y Población' });
        this.groupSelect.push({ label: 'Educación y Formación', value: 'Educación y Formación' });
        this.groupSelect.push({ label: 'Salud', value: 'Salud' });
        this.groupSelect.push({ label: 'Nivel, Calidad y Condiciones de Vida', value: 'Nivel, Calidad y Condiciones de Vida' });
        this.groupSelect.push({ label: 'Análisis Sociales, Justicia, Cultura y Deporte', value: 'Análisis Sociales, Justicia, Cultura y Deporte' });
        this.groupSelect.push({ label: 'Trabajo, Salarios y Relaciones Laborales', value: 'Trabajo, Salarios y Relaciones Laborales' });
        this.groupSelect.push({ label: 'Agricultura, Industria y Construcción', value: 'Agricultura, Industria y Construcción' });
        this.groupSelect.push({ label: 'Servicios, Comercio, Transporte y Turismo', value: 'Servicios, Comercio, Transporte y Turismo' });
        this.groupSelect.push({ label: 'Precios', value: 'Precios' });
        this.groupSelect.push({ label: 'PIB, Renta, Comercio Exterior y Empresas', value: 'PIB, Renta, Comercio Exterior y Empresas' });
        this.groupSelect.push({ label: 'Financieras. Mercantiles. Tributarias', value: 'Financieras. Mercantiles. Tributarias' });
        this.groupSelect.push({ label: 'I+D+i y Tecnologías de la Información (TIC)', value: 'I+D+i y Tecnologías de la Información (TIC)' });
        this.groupSelect.push({ label: 'Medio Ambiente y Energía', value: 'Medio Ambiente y Energía' });
        this.groupSelect.push({ label: 'Sector Público. Elecciones', value: 'Sector Público. Elecciones' });
    }

    setInfoTables() {
        this.datasetsService.getNewestDataset().subscribe(datasets => {
            this.newestDatasets = JSON.parse(datasets).result.results;
        });
        this.datasetsService.getDownloadedDataset().subscribe(datasets => {
            this.downloadedDatasets = JSON.parse(datasets).result.results;
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
        this.datasetsService.getDatasetsStats().subscribe(datasets => {
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
        });
    }

    filterTag(query, tags: any[]): any[] {
        let filtered = [];
        for (let i = 0; i < tags.length; i++) {
            let tag = tags[i];
            if (tag.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push({ name: tag, value: tag });
            }
        }
        return filtered;
    }

    filterTagsMultiple(event) {
        let query = event.query;
        this.datasetsService.getTags(query).subscribe(tags => {
            this.filteredTagsMultiple = this.filterTag(query, tags.result);
        });
    }
}