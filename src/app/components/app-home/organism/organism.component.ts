import { Component, OnInit } from '@angular/core';
import { PublicadorService } from "../../../services/publicador/publicador.service";
import { Publicador } from "../../../models/Publicador";
import { SelectItem } from "primeng/primeng";

@Component({
  selector: 'app-organism',
  templateUrl: './organism.component.html',
  styleUrls: ['./organism.component.css']
})
export class OrganismComponent implements OnInit {

  views: SelectItem[];
  selectedView: boolean = true;
  numDatasets: number = 25;

  publicadores: Publicador[];
  hovers: any[] = [];

  constructor(private publicadorService: PublicadorService) { }

  ngOnInit() {
    this.publicadores = this.publicadorService.getPublicadores();
    this.setHovers(this.publicadores);

    this.views = [];
    this.views.push({label:'Selecciona una vista', value: this.selectedView});
    this.views.push({label:'Ver como lista', value: false});
    this.views.push({label:'Ver como ficha', value: true});
  }

  setHovers(publicadores: Publicador[]) {
    for(let pub of publicadores) {
      this.hovers.push({ label: pub.name, hover: false });
    }
  }

  setHover(name, index) {
    for (let hover of this.hovers){
      if(hover.label === name) {
        hover.hover = !hover.hover;
      }
    }
  }

  unsetHover(name, index) {
    for (let hover of this.hovers){
      if(hover.label === name) {
        hover.hover = !hover.hover;
      }
    }
  }

}
