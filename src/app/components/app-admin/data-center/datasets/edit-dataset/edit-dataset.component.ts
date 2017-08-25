import { Component, OnInit } from '@angular/core';
import {DatasetService} from '../../../../../services/dataset/dataset.service';
import {Dataset} from '../../../../../models/Dataset';
import {TopicService} from '../../../../../services/topic/topic.service';
import {Topic} from '../../../../../models/Topic';
import {SelectItem} from 'primeng/primeng';
import {PublicadorService} from '../../../../../services/publicador/publicador.service';
import {Publicador} from '../../../../../models/Publicador';
import { Observable } from "rxjs/Rx";

@Component({
  selector: 'app-edit-dataset',
  templateUrl: './edit-dataset.component.html',
  styleUrls: ['./edit-dataset.component.css']
})
export class EditDatasetComponent implements OnInit {

  dataset: Dataset;
  topics: SelectItem[] = [];

  value: number = 0;
  checked: boolean = false;
  editEnable: boolean = false;
  splitted: string [];
  baseUrl: string = '';
  editableUrl: string = '';
  selectedTopic: string;
  languajes: string[];
  freq: SelectItem[];
  urlsCalidad: string[];
  publicadores: SelectItem[] = [];
  selectedPublicador: string;
  accesoRecurso: SelectItem[];
  vistas: SelectItem[];
  formatos: SelectItem[];
  accessModes: SelectItem[];
  accesoSelected: SelectItem;
  uploadedFiles: any[] = [];
  files: string[];

  constructor(private datasetService: DatasetService, private topicService: TopicService, private publicadoresService: PublicadorService) { }

  ngOnInit() {
    this.dataset = this.datasetService.getDataset();
    this.dataset.untilDate = new Date;
    this.setTopics(this.topicService.getTopics());
    this.selectedTopic = this.dataset.topic.name;
    this.files = [];
    this.languajes = ['Español', 'Inglés', 'Francés', 'Lenguas aragonesas', 'Otro'];
    this.freq = [
      { label: "Anual", value: 'Anual'},
      { label: "Semestral", value: 'Semestral'},
      { label: "Cuatrimestral", value: 'Cuatrimestral'},
      { label: "Trimestral", value: 'Trimestral'},
      { label: "Mensual", value: 'Mensual'},
    ];
    this.accesoRecurso = [
      { label: 'Enlace a un archivo público', value: '0' },
      { label: 'Vista de basede datos', value: '1' },
      { label: 'Sube fichero a AOD', value: '2' }
    ];
    this.vistas = [
      { label: 'Elecciones', value: '0' },
      { label: 'Símbolos', value: '1' },
      { label: 'Pleno municipio', value: '2' }
    ];
    this.formatos = [
      { label: 'JSON', value: '0' },
      { label: 'XML', value: '1' },
      { label: 'CSV', value: '2' },
      { label: 'RDF', value: '3' }
    ];
    this.accessModes = [
      { label: 'CSV', value: '0' },
      { label: 'DGN', value: '1' },
      { label: 'DWG', value: '2' }
    ];

    this.setPublicadores(this.publicadoresService.getPublicadores());
    this.selectedPublicador = this.dataset.publicador.name;

    this.urlsCalidad = [''];

    this.splitted = this.dataset.url.split('/');
    this.editableUrl = this.splitted[this.splitted.length - 1];
    this.splitted.splice(this.splitted.length - 1, 1);
    this.baseUrl = this.splitted.join('/') + '/';
  }

  edit() {
    this.editEnable = !this.editEnable;
  }

  save() {
    this.editEnable = !this.editEnable;
  }

  setPublicadores(publicadores: Publicador[]) {
    for( let i = 0; i < publicadores.length; i++) {
      this.publicadores.push({ label: publicadores[i].name, value: publicadores[i].name});
    }
  }

  setTopics(topics: Observable<Topic>) {
    var index;
    topics.forEach(element => {
      index++;
      this.topics.push({label: topics[index].name, value: topics[index].name});
    });
    // for( let i = 0; i < topics.; i++) {
    //   this.topics.push({label: topics[i].name, value: topics[i].name});
    // }
  }

  onUpload(event) {
    for(let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  deleteFile(index) {
    this.files.splice(index, 1);
  }

  addFile() {
    this.files.push("");
  }
}
