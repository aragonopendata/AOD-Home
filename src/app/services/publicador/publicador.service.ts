import { Injectable } from '@angular/core';
import {Publicador} from '../../models/Publicador';

@Injectable()
export class PublicadorService {

  publicadores: Publicador[];

  constructor() {
    this.publicadores = [
      new Publicador("Dirección de Comunicación"),
      new Publicador("Dirección General de Administración Electrónica y Sociedad de la Información"),
      new Publicador("Dirección General de Administración Local"),
      new Publicador("Dirección General de Contratación, Patrimonio y Organización"),
      new Publicador("Dirección General de Cultura y Patrimonio"),
      new Publicador("Dirección General de Industria, PYMES, Comercio y Artesanía"),
      new Publicador("Dirección General de Movilidad e Infraestructuras"),
      new Publicador("Dirección General de Planificación y Formación Profesional"),
      new Publicador("Dirección General de Presupuestos, Financiación y Tesorería"),
      new Publicador("Dirección General de Producción Agraria"),
      new Publicador("Dirección General de Protección de Consumidores y Usuarios"),
      new Publicador("Dirección General de Relaciones Institucionales y Desarrollo Estatutario"),
      new Publicador("Dirección General de Sostenibilidad"),
      new Publicador("Dirección General de Trabajo")
    ];
  }

  getPublicadores() {
    return this.publicadores;
  }

}
