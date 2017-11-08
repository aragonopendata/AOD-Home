import { Injectable } from '@angular/core';
import { OrganizationAdmin } from '../../models/OrganizationAdmin';
import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Constants } from '../../app.constants';

@Injectable()
export class OrganizationsAdminService {

	organizations: OrganizationAdmin[];
	organization: OrganizationAdmin;

	constructor(private http: Http) {}

	public getOrganization(){
		return this.organization;
	}

	public setOrganization(organization: OrganizationAdmin){
		this.organization = organization;
	}

	public getOrganizations() {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_ORGANIZATIONS;
		return this.http.get(fullUrl).map(res => res.json());
	}

	public getOrganizationByName(organizationName: string) {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_ORGANIZATIONS 
						+ '/' + organizationName;
		return this.http.get(fullUrl).map(res => res.json());
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
