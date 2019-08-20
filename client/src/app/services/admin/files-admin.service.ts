import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers} from '@angular/http';
import { Constants } from 'app/app.constants';
import { map } from 'rxjs/operators';

@Injectable()
export class FilesAdminService {
	private file: File;
	currentUser: any;
	
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

	private buildRequestHeaders() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return headers;
	}

	setFile(file: File) {
		this.file = file;
	}

	getFile() {
		return this.file;
	}

	public createFile(newFile: any, datasetid) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_CREATE_FILE;
		let headers = this.buildRequestHeaders();
		let formData:FormData = new FormData();
		if(newFile != null){
			formData.append('file', newFile, datasetid + '-mapeo_ei2a.xlsm');
			formData.append('filename', datasetid + '-mapeo_ei2a.xlsm');
		}
		let options = new RequestOptions({ headers: headers});
		return this.http.post(fullUrl, formData, options).pipe(map(res => res.json()));
	}

	public downloadFile(fileid) {
		let fullUrl = Constants.AOD_API_ADMIN_BASE_URL + Constants.SERVER_API_DOWNLOAD_FILE + '?fileid=' + fileid;
		let headers = this.buildRequestHeaders();
		headers.append('responseType', "arraybuffer");
		let options = new RequestOptions({ headers: headers});
		return this.http.get(fullUrl, options);
	}

}
