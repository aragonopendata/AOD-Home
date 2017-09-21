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
    sort: string;
    datasets: Dataset[];
    dataset: Dataset;
    numDatasets: number;
    pageRows: number;

    @Input() topics: Topic[];
    topic: Topic;
    topicsSelect: SelectItem[];
    datasetTypes: SelectItem[];
    searchOptions: SelectItem[];

    constructor(private datasetsService: DatasetsService, private topicsService: TopicsService, private router: Router
              , private location: Location, private changeDetectorRef: ChangeDetectorRef
              , private constants: ConstantsService) {
        this.pageRows = constants.DATASET_LIST_ROWS_PER_PAGE;
    }

    ngOnInit() {
        this.sort = 'relevance,-metadata_modified';
        this.setTopicsDropdown();
        this.loadDatasets();
        this.setDatasetsTypeDropdown();
        this.setSearchOptions();
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
        this.searchOptions.push({ label: 'Búsqueda libre', value: 'Búsqueda libre' });
        this.searchOptions.push({ label: 'Tema y tipo', value: 'Tema y tipo' });
        this.searchOptions.push({ label: 'Organización y tipo', value: 'Organización y tipo' });
        this.searchOptions.push({ label: 'Etiquetas', value: 'Etiquetas' });
        this.searchOptions.push({ label: 'Información estadística', value: 'Información estadística' });
        this.searchOptions.push({ label: 'Buscador Homer', value: 'Buscador Homer' });
    }
}
