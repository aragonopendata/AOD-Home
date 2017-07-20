import { Injectable } from '@angular/core';
import { Org } from "../../models/Org";
import { Publicador } from "../../models/Publicador";
import { PublicadorService } from "../publicador/publicador.service";

@Injectable()
export class OrgsService {

  private orgs: Org[];
  private publicadores: Publicador[];
  private org: Org;
  private publicador: Publicador;

  constructor(private publicadoresService: PublicadorService) {
    this.publicadores = publicadoresService.getPublicadores();
    this.orgs = [];
    for(let pub of this.publicadores){
      this.orgs.push(new Org(pub.name, 'http://www.org'+this.publicadores.indexOf(pub)+'.es', 'Descripción '+this.publicadores.indexOf(pub), 'Dirección '+this.publicadores.indexOf(pub), 'Responsable '+this.publicadores.indexOf(pub), 'Contacto '+this.publicadores.indexOf(pub), 25))
    }
  }

  getOrgs() {
    return this.orgs;
  }

  setOrg(org: Org) {
    this.org = org;
  }

  getOrg() {
    return this.org;
  }
}
