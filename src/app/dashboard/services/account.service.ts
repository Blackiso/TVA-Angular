import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlsService } from '../../services/urls.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

	updateAccountURL:string = "/api/account/update";
	accountURL:string = "/api/account/details";
	supportURL:string = "/api/account/support";

	constructor(private http:HttpClient, private url:UrlsService) { }

	updateAccount(data) {
		var url = this.url.prefix+this.updateAccountURL;
		return this.http.patch<any>(url, data);
	}

	accountDetails() {
		var url = this.url.prefix+this.accountURL;
		return this.http.get<any>(url);
	}

	support(data) {
		var url = this.url.prefix+this.supportURL;
		return this.http.post<any>(url, data);
	}
}
