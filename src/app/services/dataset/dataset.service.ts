import { Injectable } from '@angular/core';
import {Dataset} from '../../models/Dataset';
import {Topic} from '../../models/Topic';
import {TopicService} from '../topic/topic.service';
import {PublicadorService} from '../publicador/publicador.service';
import {Publicador} from '../../models/Publicador';

@Injectable()
export class DatasetService {

  private datasets: Dataset[];
  private dataset: Dataset;
  topics: Topic [];
  publicadores: Publicador[];

  constructor(private topicService: TopicService, private publicadorService: PublicadorService) {
    this.topics = this.topicService.getTopics();
    this.publicadores = this.publicadorService.getPublicadores();
    this.datasets = [
      new Dataset('Encuesta sobre la implantación de TIC en Hogares de Zonas Blancas de Aragón. 2016',
          'http://opendata.aragon.es/datos/encuesta-sobre-la-implantacion-de-tic-en-hogares-de-zonas-blancas-de-aragon-2016',
          'Difusión de los datos sobre uso TIC en los hogares de las llamadas Zonas blancas de Aragón según la estadística' +
          'desarrollada por el Servicio de Nuevas tecnologías y Sociedad de la Información del Gobierno de Aragón.',
          this.topics[0],
          (new Date),
          this.publicadores[5]
      ),
      new Dataset('Uso de las TIC. Personas por sexo. Año 2015',
          'http://opendata.aragon.es/datos/uso-de-las-tic-personas-por-sexo-ano-2015',
          'Avance de resultados de la Encuesta TICH 2015, según la explotación del fichero de microdatos del INE,' +
          'que recoge los resultados principales de viviendas y personas acerca del uso de las tecnologías de la información y' +
          'comunicación en los hogares donde residen',
          this.topics[3],
          (new Date),
          this.publicadores[2]
      )
    ];
  }

  getDatasets() {
    return this.datasets;
  }

  setDataset(dataset: Dataset) {
    this.dataset = dataset;
  }

  getDataset() {
    return this.dataset;
  }

  addToCollection(dataset: Dataset) {
    if (this.datasets.indexOf(dataset) !== -1) {
      return;
    }
    this.datasets.push(dataset);
  }

  removeDataset(dataset: Dataset) {
    this.datasets.splice(this.datasets.indexOf(dataset), 1);
  }
}
