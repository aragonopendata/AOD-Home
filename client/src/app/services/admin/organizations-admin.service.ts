import { Injectable } from '@angular/core';
import { OrganizationAdmin } from '../../models/OrganizationAdmin';

@Injectable()
export class OrganizationsAdminService {

	organizations: OrganizationAdmin[];

	constructor() {
		this.organizations = [
			new OrganizationAdmin('Dirección de Comunicación', '25', null, null, null, null, null, null),
			new OrganizationAdmin('Dirección General de Administración Electrónica y Sociedad de la Información', '25', null, null, null, null, null, null),
			new OrganizationAdmin('Dirección General de Administración Local', '25', null, null, null, null, null, null),
			new OrganizationAdmin('Dirección General de Contratación, Patrimonio y Organización', '25', null, null, null, null, null, null),
			new OrganizationAdmin('Dirección General de Cultura y Patrimonio', '25', null, null, null, null, null, null),
			new OrganizationAdmin('Dirección General de Industria, PYMES, Comercio y Artesanía', '25', null, null, null, null, null, null),
			new OrganizationAdmin('Dirección General de Movilidad e Infraestructuras', '25', null, null, null, null, null, null),
			new OrganizationAdmin('Dirección General de Planificación y Formación Profesional', '25', null, null, null, null, null, null),
			new OrganizationAdmin('Dirección General de Presupuestos, Financiación y Tesorería', '25', null, null, null, null, null, null),
			new OrganizationAdmin('Dirección General de Producción Agraria', '25', null, null, null, null, null, null),
			new OrganizationAdmin('Dirección General de Protección de Consumidores y Usuarios', '25', null, null, null, null, null, null),
			new OrganizationAdmin('Dirección General de Relaciones Institucionales y Desarrollo Estatutario', '25', null, null, null, null, null, null),
			new OrganizationAdmin('Dirección General de Sostenibilidad', '25', null, null, null, null, null, null),
			new OrganizationAdmin('Dirección General de Trabajo', '25', null, null, null, null, null, null),
		];
	}

	getOrganizations() {
		return this.organizations;
	}

	//private orgs: Org[];
	//private publicadores: Publicador[];
	//private publicador: Publicador;

	//constructor(private publicadoresService: PublicadorService) {
		//this.publicadores = publicadoresService.getPublicadores();
		//this.orgs = [];
		//for(let pub of this.publicadores){
			//this.orgs.push(new Org(pub.name, 'http://www.org'+this.publicadores.indexOf(pub)+'.es', 'Descripción '+this.publicadores.indexOf(pub), 'Dirección '+this.publicadores.indexOf(pub), 'Responsable '+this.publicadores.indexOf(pub), 'Contacto '+this.publicadores.indexOf(pub), 25))
		//}
	//}

}
