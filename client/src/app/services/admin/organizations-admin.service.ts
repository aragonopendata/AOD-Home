import { Injectable } from '@angular/core';
import { OrganizationAdmin } from '../../models/OrganizationAdmin';
import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Constants } from '../../app.constants';

@Injectable()
export class OrganizationsAdminService {
	currentUser: any;

	organizations: OrganizationAdmin[];
	organization: OrganizationAdmin;

	constructor(private http: Http) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	public getCurrentUser() {
		return this.currentUser;
	}

	private createAuthorizationHeader(headers: Headers) {
		if (this.currentUser && this.currentUser.token && this.currentUser.key) {
			//Authorization header: API_KEY:JWT_Token
			let authorizationHeaderValue = this.currentUser.token + ':' + this.currentUser.key;
			headers.append('Authorization', authorizationHeaderValue);
		}
	}

	private buildRequestHeaders() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		headers.append('Content-Type', ' application/json');
		return headers;
	}

	public getOrganization(){
		return this.organization;
	}

	public setOrganization(organization: OrganizationAdmin){
		this.organization = organization;
	}

	public getOrganizations() {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_ORGANIZATIONS;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public getOrganizationByName(organizationName: string) {
		let fullUrl = Constants.AOD_API_WEB_BASE_URL + Constants.SERVER_API_LINK_ORGANIZATIONS 
						+ '/' + organizationName;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).map(res => res.json());
	}

	public createOrganization(organization: OrganizationAdmin, webpage: string, address: string, person: string) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_ORGANIZATION_CUD_OPERATIONS;
        let requestBodyParams = {
			name: organization.name,
			title: organization.title,
			description: organization.description,
			extras: []
		};
		if(webpage != undefined){
			var webpageNotEmpty = {
				key: Constants.ORGANIZATION_EXTRA_WEBPAGE,
				value: webpage
			}
			requestBodyParams.extras.push(webpageNotEmpty);
		}
		if(address != undefined){
			var addressNotEmpty = {
				key: Constants.ORGANIZATION_EXTRA_ADDRESS,
				value: address
			}
			requestBodyParams.extras.push(addressNotEmpty);
		}
		if(person != undefined){
			var personNotEmpty = {
				key: Constants.ORGANIZATION_EXTRA_PERSON,
				value: person
			}
			requestBodyParams.extras.push(personNotEmpty);
		}
		let headers = this.buildRequestHeaders();
		let options = new RequestOptions({ headers: headers}); // Create a request option
		return this.http.post(fullUrl, JSON.stringify(requestBodyParams), options).map((res:Response) => res.json());
    }

	public updateOrganization(organization: OrganizationAdmin){
		let headers = this.buildRequestHeaders();
	    let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_ORGANIZATION_CUD_OPERATIONS;
	    return this.http.put(fullUrl, JSON.stringify(organization), {headers: headers}).map(res => res.json());
	}

	public removeOrganization(organization_name: string, user_id: number,  user_name:string) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_LINK_ADMIN_ORGANIZATION_CUD_OPERATIONS;
		let requestBodyParams = {
			name:organization_name
		};
		let headers = this.buildRequestHeaders();
		let options = new RequestOptions({ headers: headers, body: JSON.stringify(requestBodyParams)});
		return this.http.delete(fullUrl, options).map((res:Response) => res.json());
	} 


}