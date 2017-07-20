import { Component, OnInit } from '@angular/core';
import { PublicadorService } from "../../../services/publicador/publicador.service";
import { Publicador } from "../../../models/Publicador";
import { SelectItem } from "primeng/primeng";
import { Org } from "../../../models/Org";
import { OrgsService } from "../../../services/orgs/orgs.service";

@Component({
  selector: 'app-organism',
  templateUrl: './organism.component.html',
  styleUrls: ['./organism.component.css']
})
export class OrganismComponent implements OnInit {

  views: SelectItem[];
  selectedView: boolean = true;

  orgs: Org[];
  hovers: any[] = [];

  constructor(private orgService: OrgsService) { }

  ngOnInit() {
    this.orgs = this.orgService.getOrgs();
    this.setHovers(this.orgs);

    this.views = [];
    this.views.push({label:'Selecciona una vista', value: this.selectedView});
    this.views.push({label:'Ver como lista', value: false});
    this.views.push({label:'Ver como ficha', value: true});
  }

  setHovers(orgs: Org[]) {
    for(let org of orgs) {
      this.hovers.push({ label: org.orgName, hover: false });
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

  showOrg(org: Org) {
    this.orgService.setOrg(org);
  }

}
