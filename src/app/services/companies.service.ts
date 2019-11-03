import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

	allCompaniesUrl:string = "/api/companies/all";
	deleteCompanyUrl:string = "/api/companies/:id/delete";
	companyUrl:string = "/api/companies/:id";
	updateCompanyUrl:string = "/api/companies/:id/update";
	statsCompanyUrl:string = "/api/companies/:id/stats";
	addCompanyUrl:string = "/api/companies";
	searchUrl:string = "/api/companies/search";

	constructor(private http:HttpClient, private url:UrlsService) { }

	getAll(lastItem) {
		var url = this.url.prefix+this.allCompaniesUrl;
		if (lastItem !== false) url += "?last_item="+lastItem;
		return this.http.get<any>(url);
	}

	delete(id) {
		var url = this.deleteCompanyUrl.replace(":id", id);
		return this.http.delete<any>(this.url.prefix+url);
	}

	addCompany(data) {
		return this.http.post<any>(this.url.prefix+this.addCompanyUrl, data);
	}

	search(keyword) {
		return this.http.get<any>(this.url.prefix+this.searchUrl+"?keyword="+keyword);
	}

	getCompany(id) {
		var url = this.companyUrl.replace(":id", id);
		return this.http.get<any>(this.url.prefix+url);
	}

	getStats(id) {
		var url = this.statsCompanyUrl.replace(":id", id);
		return this.http.get<any>(this.url.prefix+url);
	}

	updateCompany(id, data) {
		var url = this.updateCompanyUrl.replace(":id", id);
		return this.http.patch<any>(this.url.prefix+url, data);
	}
}
