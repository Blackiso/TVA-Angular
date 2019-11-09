import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlsService } from '../../services/urls.service';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

	suppliersURL:string = "/api/bills/suppliers";
	dbsURL:string = "/api/bills/dbs";
	tableURL:string = "/api/bills/:file-id/:month/table";
	addURL:string = "/api/bills/:file-id";
	updateURL:string = "/api/bills/:bill-id";
	getAllURL:string = "/api/bills/:file-id/:month";
	searchBillsUrl:string = "/api/bills/:file-id/:month/search";
	deleleBillUrl:string = "/api/bills/delete";
	xmlUrl:string = "/api/download/:file/:month/xml";

	constructor(private http:HttpClient, private url:UrlsService) { }

	getSuppliers(keyword) {
		var url = this.url.prefix+this.suppliersURL;
		url += "?keyword="+keyword;
		return this.http.get<any>(url);
	}

	getDbs(keyword) {
		var url = this.url.prefix+this.dbsURL;
		url += "?keyword="+keyword;
		return this.http.get<any>(url);
	}

	getTable(fileId, month) {
		var url = this.url.prefix+this.tableURL;
		url = url.replace(':file-id', fileId);
		url = url.replace(':month', month);
		return this.http.get<any>(url);
	}

	getXML(fileId, month) {
		var url = this.url.prefix+this.xmlUrl;
		url = url.replace(':file', fileId);
		url = url.replace(':month', month);
		return this.http.get(url, { responseType: 'text' });
	}

	addBill(data, fileId) {
		var url = this.url.prefix+this.addURL;
		url = url.replace(':file-id', fileId);
		return this.http.post<any>(url, data);
	}

	getAll(fileId, month, lastItem) {
		var url = this.url.prefix+this.getAllURL;
		url = url.replace(':file-id', fileId);
		url = url.replace(':month', month);
		if (lastItem !== false) url += "?last_item="+lastItem;
		return this.http.get<any>(url);
	}

	updateBill(data, billId) {
		var url = this.url.prefix+this.updateURL;
		url = url.replace(':bill-id', billId);
		return this.http.patch(url, data);
	}

	deleteBills(bills) {
		var options = {
			headers: new HttpHeaders({'Content-Type': 'application/json'}),
			body : {
				ids : bills
			}
		};
		var url = this.url.prefix+this.deleleBillUrl;
		return this.http.delete<any>(url, options);
	}

	searchFor(keyword, fileId, month) {
		var url = this.url.prefix+this.searchBillsUrl;
		url = url.replace(':file-id', fileId);
		url = url.replace(':month', month);
		url += "?keyword="+keyword;
		return this.http.get<any>(url);
	}
}
