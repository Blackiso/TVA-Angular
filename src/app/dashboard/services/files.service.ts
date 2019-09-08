import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlsService } from '../../services/urls.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

	allfilesUrl:string = "/api/files/:company-id";
	searchfilesUrl:string = "/api/files/:company-id/search";
	editFileUrl:string = "/api/files/:file-id";
	detailFileUrl:string = "/api/files/:file-id/details";
	deleleFileUrl:string = "/api/files/delete";

	constructor(private http:HttpClient, private url:UrlsService) { }

	getAll(company_id, lastItem) {
		var url = this.url.prefix+this.allfilesUrl;
		url = url.replace(':company-id', company_id);
		if (lastItem !== false) url += "?last_item="+lastItem;
		return this.http.get<any>(url);
	}

	addFile(company_id, data) {
		var url = this.url.prefix+this.allfilesUrl;
		url = url.replace(':company-id', company_id);
		return this.http.post<any>(url, data);
	}

	editFile(fileId, data) {
		var url = this.url.prefix+this.editFileUrl;
		url = url.replace(':file-id', fileId);
		return this.http.patch<any>(url, data);
	}

	deleteFiles(files) {
		var options = {
			headers: new HttpHeaders({'Content-Type': 'application/json'}),
			body : {
				ids : files
			}
		};
		var url = this.url.prefix+this.deleleFileUrl;
		return this.http.delete<any>(url, options);
	}

	searchFor(keyword, companyId) {
		var url = this.url.prefix+this.searchfilesUrl;
		url = url.replace(':company-id', companyId);
		url += "?keyword="+keyword;
		return this.http.get<any>(url);
	}

	details(fileId) {
		var url = this.url.prefix+this.detailFileUrl;
		url = url.replace(':file-id', fileId);
		return this.http.get<any>(url);
	}

}
