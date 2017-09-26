import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Organization } from '../../models/Organization';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { ConstantsService } from '../../app.constants';

@Injectable()
export class OrganizationsService {

	private organization: Organization;
	private baseUrl: string;

	/**
	 * Organizations service class constructor.
	 * @param http - Http module.
	 * @param constants - Constants class.
	 */
	constructor(private http: Http, private constants: ConstantsService) {
		this.baseUrl = this.constants.AOD_API_WEB_BASE_URL;
	}

	/**
	 * Gets an organization by the given name.
	 * @param organizationName - Organization name.
	 */
	public getOrganizationByName(organizationName: string) {
		let fullUrl = this.baseUrl + '/organizations/' + organizationName;
		console.log('Servicio ORGANIZATIONS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}

	/**
	 * Gets a list of all existing organizations.
	 */
	public getOrganizations() {
		let fullUrl = this.baseUrl + '/organizations';
		console.log('Servicio ORGANIZATIONS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}

	/**
	 * Sets an organization.
	 * @param organization - Organization to set.
	 */
	public setOrganization(organization: Organization) {
		this.organization = organization;
	}

	/**
	 * Gets an organization.
	 */
	public getOrganization() {
		let fullUrl = this.baseUrl + '/organizations/' + this.organization.name;
		console.log('Servicio ORGANIZATIONS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}
}
