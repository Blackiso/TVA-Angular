import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlsService } from '../../services/urls.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

	addUsersUrl:string = "/api/users";
	getUsersUrl:string = "/api/users/:company-id/all";
	deleteUsersUrl:string = "/api/users/:user-id/delete";
	updateUsersUrl:string = "/api/users/:user-id/update";
	addUsersCompanyUrl:string = "/api/users/:user-id/add";
	searchUsersUrl:string = "/api/users/search";

	constructor(private http:HttpClient, private url:UrlsService) { }

	getAll(companyId) {
		var url = this.url.prefix+this.getUsersUrl;
		url = url.replace(':company-id', companyId);
		return this.http.get<any>(url);
	}

	detele(user, compnayId) {
		var options = {
			headers: new HttpHeaders({'Content-Type': 'application/json'}),
			body : {
				companies : compnayId
			}
		};
		var url = this.url.prefix+this.deleteUsersUrl;
		url = url.replace(':user-id', user);
		return this.http.delete<any>(url, options);
	}

	addNewUser(data) {
		var url = this.url.prefix+this.addUsersUrl;
		return this.http.post<any>(url, data);
	}

	updateUser(data, id) {
		var url = this.url.prefix+this.updateUsersUrl;
		url = url.replace(':user-id', id);
		return this.http.patch<any>(url, data);
	}

	searchUsers(keyword) {
		var url = this.url.prefix+this.searchUsersUrl+"?keyword="+keyword;
		return this.http.get<any>(url);
	}

	addUserToCompany(userId, companyId) {
		var url = this.url.prefix+this.addUsersCompanyUrl;
		url = url.replace(':user-id', userId);
		return this.http.post<any>(url, {companies : companyId});
	}
}
