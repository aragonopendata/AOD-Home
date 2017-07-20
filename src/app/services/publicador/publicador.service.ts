import { Injectable } from '@angular/core';
import {Publicador} from '../../models/Publicador';

@Injectable()
export class PublicadorService {

  publicadores: Publicador[];

  constructor() {
    this.publicadores = [
      new Publicador("Dirección de Comunicación", 25),
      new Publicador("Dirección General de Administración Electrónica y Sociedad de la Información", 25),
      new Publicador("Dirección General de Administración Local", 25),
      new Publicador("Dirección General de Contratación, Patrimonio y Organización", 25),
      new Publicador("Dirección General de Cultura y Patrimonio", 25),
      new Publicador("Dirección General de Industria, PYMES, Comercio y Artesanía", 25),
      new Publicador("Dirección General de Movilidad e Infraestructuras", 25),
      new Publicador("Dirección General de Planificación y Formación Profesional", 25),
      new Publicador("Dirección General de Presupuestos, Financiación y Tesorería", 25),
      new Publicador("Dirección General de Producción Agraria", 25),
      new Publicador("Dirección General de Protección de Consumidores y Usuarios", 25),
      new Publicador("Dirección General de Relaciones Institucionales y Desarrollo Estatutario", 25),
      new Publicador("Dirección General de Sostenibilidad", 25),
      new Publicador("Dirección General de Trabajo", 25)
    ];
  }

  getPublicadores() {
    return this.publicadores;
  }

}
