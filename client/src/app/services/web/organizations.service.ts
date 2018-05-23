import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Organization } from '../../models/Organization';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Constants } from '../../app.constants';

@Injectable()
export class OrganizationsService {

	private organization: Organization;

	constructor(private http: Http) { }

	public getOrganizationByName(organizationName: string) {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_ORGANIZATIONS 
						+ '/' + organizationName;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public getOrganizations() {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_ORGANIZATIONS;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}

	public setOrganization(organization: Organization) {
		this.organization = organization;
	}

	public getOrganization() {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_ORGANIZATIONS 
						+ '/' + this.organization.name;
		return this.http.get(fullUrl).pipe(map(res => res.json()));
	}
}
