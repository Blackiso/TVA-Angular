import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlsService } from '../../services/urls.service';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

	suppliersURL:string = "/api/bills/suppliers";
	addURL:string = "/api/bills/:file-id";
	updateURL:string = "/api/bills/:bill-id";
	getAllURL:string = "/api/bills/:file-id/:month";

	constructor(private http:HttpClient, private url:UrlsService) { }

	getSuppliers(keyword) {
		var url = this.url.prefix+this.suppliersURL;
		url += "?keyword="+keyword;
		return this.http.get<any>(url);
	}

	addBill(data, fileId) {
		var url = this.url.prefix+this.addURL;
		url = url.replace(':file-id', fileId);
		return this.http.post<any>(url, data);
	}

	getAll(fileId, month) {
		var url = this.url.prefix+this.getAllURL;
		url = url.replace(':file-id', fileId);
		url = url.replace(':month', month);
		return this.http.get<any>(url);
	}

	updateBill(data, billId) {
		var url = this.url.prefix+this.updateURL;
		url = url.replace(':bill-id', billId);
		return this.http.patch(url, data);
	}
}
