import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { ConstantsService } from '../../app.constants';

@Injectable()
export class StaticContentService {
	private baseUrl: string;

	/**
	 * Static contents service class constructor.
	 * @param http - Http module.
	 * @param constants - Constants class.
	 */
	constructor(private http: Http, private constants: ConstantsService) {
		this.baseUrl = this.constants.AOD_API_WEB_BASE_URL;
	}

	/**
	 * Gets the 'Open Data' static content of the section 'Información'.
	 */
	public getOpenDataInfoStaticContent() {
		let fullUrl = this.baseUrl + '/static-content/info/open-data';
		console.log('Servicio STATIC-CONTENTS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}

	/**
	 * Gets the 'Aplicaciones' static content of the section 'Información'.
	 */
	public getApplicationsInfoStaticContent() {
		let fullUrl = this.baseUrl + '/static-content/info/applications';
		console.log('Servicio STATIC-CONTENTS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}
	
	/**
	 * Gets the 'Eventos' static content of the section 'Información'.
	 */
	public getEventsInfoStaticContent() {
		let fullUrl = this.baseUrl + '/static-content/info/events';
		console.log('Servicio STATIC-CONTENTS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}
	
	/**
	 * Gets the 'Desarrolladores' static content of the section 'Herramientas'.
	 */
	public getDevelopersToolsStaticContent() {
		let fullUrl = this.baseUrl + '/static-content/tools/developers';
		console.log('Servicio STATIC-CONTENTS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}
	
	/**
	 * Gets the 'APIs' static content of the section 'Herramientas'.
	 */
	public getApisToolsStaticContent() {
		let fullUrl = this.baseUrl + '/static-content/tools/apis';
		console.log('Servicio STATIC-CONTENTS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}
	
	/**
	 * Gets the 'Sparql' static content of the section 'Herramientas'.
	 */
	public getSparqlToolsStaticContent() {
		let fullUrl = this.baseUrl + '/static-content/tools/sparql';
		console.log('Servicio STATIC-CONTENTS - Request: ' + fullUrl);
		return this.http.get(fullUrl).map(res => res.json());
	}
}
