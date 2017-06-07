import { Component, OnInit } from '@angular/core';
import { Org } from '../../../../models/Org'

@Component({
  selector: 'app-orgs',
  templateUrl: './orgs.component.html',
  styleUrls: ['./orgs.component.css']
})
export class OrgsComponent implements OnInit {

  displayDialog: boolean = false;
  displayDialogEdit: boolean = false;
  selectedOrg: Org;
  orgs: Org[] = [];
  results: Org[];


  constructor() {
    this.orgs = [
      new Org("Instituto de salud", "http://www.org1.es", "La Dirección General de Administración Electrónica y Sociedad de la Información es una de las tres que forman parte del Departamento de Innovación, Investigación y Universidades del Gobierno de Aragón. La Dirección General se divide en tres áreas de competencias que organizativamente encabezan tres Jefaturas de Servicio diferentes.", "Dirección 1", "Responsable 1", "Contacto 1"),
      new Org("Organización 2", "http://www.org2.es", "Descripción 2", "Dirección 2", "Responsable 2", "Contacto 2"),
      new Org("Instituto Educación Secundaria Pablo Serrano", "http://www.org2.es", "Descripción 2", "Dirección 2", "Responsable 2", "Contacto 2"),
      new Org("Organización 2", "http://www.org2.es", "Descripción 2", "Dirección 2", "Responsable 2", "Contacto 2"),
      new Org("Organización 2", "http://www.org2.es", "Descripción 2", "Dirección 2", "Responsable 2", "Contacto 2"),
      new Org("Organización 2", "http://www.org2.es", "Descripción 2", "Dirección 2", "Responsable 2", "Contacto 2"),
      new Org("Organización 2", "http://www.org2.es", "Descripción 2", "Dirección 2", "Responsable 2", "Contacto 2")
    ];
    this.results = this.orgs;
  }

  ngOnInit() { }

  selectOrg(org: Org) {
    this.selectedOrg = org;
    this.displayDialog = true;
  }

  enableEdition() {
    this.displayDialogEdit = true;
    this.displayDialog = false;
  }

  search(event) {
    let query = event.query;
    console.log(query);
    if(query == ""){
      this.results = this.orgs;
    }else {
      this.results = [];
    }
    for(let i = 0; i < this.orgs.length; i++){
      if(this.orgs[i].orgName.search(query) != -1) {
        this.selectedOrg = this.orgs[i];
        this.results.push(this.selectedOrg);
      }
    }
    console.log(this.results);
  }
}
