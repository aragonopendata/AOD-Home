import { OrganizationsService } from './../../../../services/web/organizations.service';
import { Organization } from './../../../../models/Organization';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
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

    @Input() topics: Topic[];
    topic: Topic;
    topicsSelect: SelectItem[];
    orgs: Organization[];
    orgsSelect: SelectItem[];
    datasetTypes: SelectItem[];
    searchOptions: SelectItem[];

    constructor(private datasetsService: DatasetsService, private topicsService: TopicsService, private orgsService: OrganizationsService, private router: Router
              , private location: Location, private changeDetectorRef: ChangeDetectorRef
              , private constants: ConstantsService) {
        this.pageRows = constants.DATASET_LIST_ROWS_PER_PAGE;
    }

    ngOnInit() {
        this.sort = 'relevance,-metadata_modified';
        this.setDatasetsStatics();
        this.setTopicsDropdown();
        this.setOrgsDropdown();
        this.loadDatasets();
        this.setDatasetsTypeDropdown();
        this.setSearchOptions();
        this.setInfoTables();
    }

    loadDatasets() {
        this.datasets = [];
        if (this.selectedTopic === undefined) {
            this.getDatasets(null, null);
        } else {
            this.getDatasetsByTopic(this.selectedTopic, null, null);
        }
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

    setTopicData() {
        this.loadDatasets();
        //this.location.replaceState('/home/data/topic/' + this.selectedTopic);
    }

    paginate(event) {
        if (this.selectedTopic === undefined) {
            this.getDatasets(event.page, event.rows);
        } else {
            this.getDatasetsByTopic(this.selectedTopic, event.page, event.rows);
        }
        document.body.scrollTop = 0;
    }

    getDatasets(page: number, rows: number): void {
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasets(this.sort, pageNumber, rowsNumber).subscribe(datasets => {
            this.datasets = JSON.parse(datasets).result.results;
            this.numDatasets = JSON.parse(datasets).result.count;
        });
    }

    getDatasetsByTopic(topic: string, page: number, rows: number): void {
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsByTopic(topic, this.sort, pageNumber, rowsNumber).subscribe(datasets => {
            this.datasets =  JSON.parse(datasets).result.results;
            this.numDatasets =  JSON.parse(datasets).result.count;
        });
    }

    getDatasetsBySearch(page: number, rows: number, searchParam: string): void {
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsByText(this.sort, pageNumber, rowsNumber,searchParam).subscribe(datasets => {
            this.datasets = JSON.parse(datasets).result.results;
            this.numDatasets = JSON.parse(datasets).result.count;
        });
    }

    getDatasetsByOrg(page: number, rows: number, org: string): void {
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsByOrganization(org, this.sort, pageNumber, rowsNumber).subscribe(datasets => {
            this.datasets = JSON.parse(datasets).result.results;
            this.numDatasets = JSON.parse(datasets).result.count;
        });
    }

    setTopicsDropdown() {
        this.topicsSelect = [];
        this.topicsService.getTopics().subscribe(topics => {
            this.topics = JSON.parse(topics).result;
            for (let top of this.topics) {
                this.topicsSelect.push({ label: top.title, value: top.name });
            }
        });
        this.getSelectedTopic();
    }
    setOrgsDropdown() {
        this.orgsSelect = [];
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
        this.datasetTypes.push({ label: 'Calendario', value: 'Calendario' });
        this.datasetTypes.push({ label: 'Fotos', value: 'Fotos' });
        this.datasetTypes.push({ label: 'Hojas de Calculo', value: 'Hojas de Calculo' });
        this.datasetTypes.push({ label: 'Mapas', value: 'Mapas' });
        this.datasetTypes.push({ label: 'Recursos Educativos', value: 'Recursos Educativos' });
        this.datasetTypes.push({ label: 'Recursos Web', value: 'Recursos Web' });
        this.datasetTypes.push({ label: 'RSS', value: 'RSS' });
        this.datasetTypes.push({ label: 'Texto plano', value: 'Texto plano' });
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

    setInfoTables(){
        this.datasetsService.getNewestDataset().subscribe(datasets => {
            this.newestDatasets =  JSON.parse(datasets).result.results;
        });
        this.datasetsService.getDownloadedDataset().subscribe(datasets => {
            this.downloadedDatasets =  JSON.parse(datasets).result.results;
        });
    }

    searchDatasetsByText(searchParam: string){
        this.datasets = [];
        this.getDatasetsBySearch(null, null,searchParam);
    }

    searchDatasetsetByOrg(){
        this.datasets = [];
        this.getDatasetsByOrg(null, null, this.selectedOrg);
    }

    setDatasetsStatics(){
        this.datasetsService.getDatasetsStatics().subscribe(datasets => {
            this.datasetCount =JSON.parse(datasets).result.count+"";
            while (this.datasetCount.length < 8) this.datasetCount = "0" + this.datasetCount;
            return this.datasetCount;
            
        });

    
    }

}
