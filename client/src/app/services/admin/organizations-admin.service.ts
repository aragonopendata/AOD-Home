import { Injectable } from '@angular/core';
import { OrganizationAdmin } from '../../models/OrganizationAdmin';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

	public refreshUser() {
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

	private buildRequestHeadersforFormData() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return headers;
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
		this.refreshUser();
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_ORGANIZATIONS;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).pipe(map(res => res.json()));
	}

	public getOrganizationByName(organizationName: string) {
		this.refreshUser();
		let fullUrl = window["config"]["AOD_API_WEB_BASE_URL"] + Constants.SERVER_API_LINK_ORGANIZATIONS 
						+ '/' + organizationName;
		let headers = this.buildRequestHeaders();
		return this.http.get(fullUrl, { headers: headers }).pipe(map(res => res.json()));
	}

	public createOrganization(image: any, organization: OrganizationAdmin, webpage: string, address: string, person: string, siuCode: string) {
		this.refreshUser();
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_ORGANIZATION_CUD_OPERATIONS;
		
		let formData:FormData = new FormData();  
		let extras = [];
		if (image != null) {
			formData.append('file', image, image.name);
		}

		formData.append('name', organization.name);
		formData.append('title', organization.title);
		if (organization.description != undefined){
			formData.append('description', organization.description);
		}

		if(webpage != undefined){
			var webpageNotEmpty = {
				key: Constants.ORGANIZATION_EXTRA_WEBPAGE,
				value: webpage
			}
			extras.push(webpageNotEmpty);
			
		}
		if(address != undefined){
			var addressNotEmpty = {
				key: Constants.ORGANIZATION_EXTRA_ADDRESS,
				value: address
			}
			extras.push(addressNotEmpty);
		}
		if(person != undefined){
			var personNotEmpty = {
				key: Constants.ORGANIZATION_EXTRA_PERSON,
				value: person
			}
			extras.push(personNotEmpty);
		}

		if(siuCode != undefined){
			var siuCodeNotEmpty = {
				key: Constants.ORGANIZATION_EXTRA_SIUCODE,
				value: siuCode
			}
			extras.push(siuCodeNotEmpty);
		}

		formData.append('extras', JSON.stringify(extras));
		let headers = this.buildRequestHeadersforFormData();
		let options = new RequestOptions({ headers: headers}); // Create a request option
		return this.http.post(fullUrl, formData, options).pipe(map((res:Response) => res.json()));
    }

	public updateOrganization(organization: OrganizationAdmin){
	    let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_ORGANIZATION_CUD_OPERATIONS;
		let headers = this.buildRequestHeaders();
		let requestBodyParams: any = organization;
		return this.http.put(fullUrl, JSON.stringify(requestBodyParams), { headers: headers }).pipe(map(res => res.json()));
	}

	public removeOrganization(organization_name: string, user_id: number,  user_name:string) {
		let fullUrl = window["config"]["AOD_API_ADMIN_BASE_URL"] + Constants.SERVER_API_LINK_ADMIN_ORGANIZATION_CUD_OPERATIONS;
		let requestBodyParams = {
			name:organization_name
		};
		let headers = this.buildRequestHeaders();
		let options = new RequestOptions({ headers: headers, body: JSON.stringify(requestBodyParams)});
		return this.http.delete(fullUrl, options).pipe(map((res:Response) => res.json()));
	} 


}