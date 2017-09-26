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
import { Topic } from '../../../../models/Topic';
import { ConstantsService } from '../../../../app.constants';

@Component({
    selector: 'app-datasets-list',
    templateUrl: './datasets-list.component.html',
    styleUrls: ['./datasets-list.component.css']
})

export class DatasetsListComponent implements OnInit {

    selectedTopic: string;
    selectedOrg: string;
    selectedType: string;
    selectedSearchOption: string = 'busqueda-libre';
    sort: string;
    datasets: Dataset[];
    newestDatasets: Dataset[];
    downloadedDatasets: Dataset[];
    dataset: Dataset;
    numDatasets: number;
    pageRows: number;
    totalDataset: string[];
    datasetCount: string;
    totalResources: string;
    searchValue: string = '';
    textSearch: string;
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

    constructor(private datasetsService: DatasetsService, private topicsService: TopicsService, private orgsService: OrganizationsService, private router: Router
        , private location: Location, private changeDetectorRef: ChangeDetectorRef
        , private constants: ConstantsService, private activatedRoute: ActivatedRoute) {
        this.pageRows = constants.DATASET_LIST_ROWS_PER_PAGE;
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.textSearch = params['texto'];
        });
        this.activatedRoute.params.subscribe(params => {
            this.selectedTopic = params['topicName'];
        });

        this.sort = 'relevance,-metadata_modified';
        this.setDatasetsStats();
        this.setTopicsDropdown();
        this.setOrgsDropdown();
        this.loadDatasets();
        this.setDatasetsTypeDropdown();
        this.setSearchOptions();
        this.setLanguagesDropdown();
        this.setInfoTables();
    }

    loadDatasets() {
        this.datasets = [];
        if (this.textSearch != undefined) {
            this.searchDatasetsByText(this.textSearch);
            this.searchValue = this.textSearch;
        } else if (this.selectedTopic) {
            this.getDatasetsByTopic(this.selectedTopic, null, null, this.selectedType);
            this.selectedSearchOption = 'tema-y-tipo';
        } else if (this.selectedOrg) {
            this.getDatasetsByOrg(null, null, this.selectedOrg, this.selectedType);
        } else {
            this.selectedType = undefined;
            this.getDatasets(null, null);
        }
    }

    changeType() {
        if (this.selectedTopic) {
            this.getDatasetsByTopic(this.selectedTopic, null, null, this.selectedType);
        } else if (this.selectedOrg) {
            this.getDatasetsByOrg(null, null, this.selectedOrg, this.selectedType);
        } else {
            this.selectedType = undefined;
            this.getDatasets(null, null);
        }
    }

    resetSearch() {
        this.selectedTopic = undefined;
        this.selectedOrg = undefined;
        this.selectedType = undefined;
        this.searchValue = '';
        this.tags = [];
        this.textSearch = undefined;
        this.loadDatasets();
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
            case 'name':
                this.sort == 'title_string' ? this.sort = '-title_string' : this.sort = 'title_string';
                break;
            case 'accesos':
                this.sort == 'views_total' ? this.sort = '-views_total' : this.sort = 'views_total';
                break;
            case 'lastUpdate':
                this.sort == 'metadata_modified' ? this.sort = '-metadata_modified' : this.sort = 'metadata_modified';
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
        this.searchOptions.push({ label: 'Búsqueda libre', value: 'busqueda-libre' });
        this.searchOptions.push({ label: 'Tema y tipo', value: 'tema-y-tipo' });
        this.searchOptions.push({ label: 'Organización y tipo', value: 'organizacion-y-tipo' });
        this.searchOptions.push({ label: 'Etiquetas', value: 'etiquetas' });
        this.searchOptions.push({ label: 'Información estadística', value: 'informacion-estadistica' });
        this.searchOptions.push({ label: 'Buscador Homer', value: 'buscador-homer' });
    }

    setLanguagesDropdown() {
        this.langsSelect = [];
        this.langsSelect.push({ label: 'Español', value: 'es' });
        this.langsSelect.push({ label: 'English', value: 'en' });
        this.langsSelect.push({ label: 'Français', value: 'fr' });
        this.langsSelect.push({ label: 'Italiano', value: 'it' });
        this.langsSelect.push({ label: 'ελληνικά', value: 'es' });
        this.langsSelect.push({ label: 'Slovenščina', value: 'es' });
        this.langsSelect.push({ label: 'Српски', value: 'es' });
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


    setDatasetsStats() {
        this.datasetsService.getDatasetsStats().subscribe(datasets => {
            this.datasetCount = JSON.parse(datasets).result.count + "";
            while (this.datasetCount.length < 8) this.datasetCount = "0" + this.datasetCount;
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