import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

	private createPaymentURL = "/api/payment/create";
	private capturePaymentURL = "/api/payment/capture?token=";
	private paymentHistoryURL = "/api/payment/history";
	private paymentRefundURL = "/api/payment/:id/refund";

	constructor(private http:HttpClient, private url:UrlsService) { }

	createPayment(referenceId, monts) {
		var url = this.url.prefix+this.createPaymentURL;
		var body = {
			reference_id : referenceId,
			months : monts
		};
		return this.http.post<any>(url, body);
	}

	capturePayment(token) {
		var url = this.url.prefix+this.capturePaymentURL+token;
		return this.http.get<any>(url);
	}

	paymentHistory() {
		var url = this.url.prefix+this.paymentHistoryURL;
		return this.http.get<any>(url);
	}

	refundPayment(id) {
		var url = this.url.prefix+this.paymentRefundURL;
		url = url.replace(':id', id);
		return this.http.get<any>(url);
	}
}
