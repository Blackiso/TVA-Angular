import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PaymentService } from '../../../../services/payment.service';
import { UserDataService } from '../../../../services/user-data.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { HelperModule } from '../../../../modules/helper.module';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['../settings.component.css']
})
export class PaymentsComponent implements OnInit {

	@Output() error = new EventEmitter<boolean>();
	refundAlert:boolean = false;
	alertType:string = 'refund';
	selectedPayment:string;
	data:any;
	loading:boolean = false;

	constructor(
		private paypmentService:PaymentService, 
		private authSearvice:AuthenticationService,
		public userData:UserDataService,
		private helper:HelperModule
	) {}

	ngOnInit() {
		this.loading = true;
		this.paypmentService.paymentHistory().subscribe(
			response => {
				this.loading = false;
				if (!!response.error) {
					this.error.emit(true);
				}else {
					this.insertData(response);
				}
			},
			err => {
				this.loading = false;
				this.error.emit(true);
			}
		);
	}

	insertData(data) {
		data.forEach((payment, i) => {
			var date = payment.payment_time.split(' ')[0];
			if (i !== 0) {
				data[i].refunded = 'no';
			}else {
				if (data.length > 1) {
					data[i].refunded = 'no';
				}else {
					date = new Date(date).getTime();
					date = new Date(date + 2 * 24 * 60 * 60 * 1000).getTime();
					var now = new Date().getTime();
					if (payment.refunded == 0) {
						if (now > date) {
							data[i].refunded = 'no';
						}
					}
				}
			}
		});
		this.data = data;
	}

	startRefund(id) {
		this.alertType = 'refund';
		this.selectedPayment = id;
		this.refundAlert = true;
	}

	alertAnswer(e) {
		this.refundAlert = false;
		if (e) {
			if (this.alertType == 'refund') {
				this.refund();
			}else {
				this.logout();
			}
		}
	}

	showDoneAlert() {
		this.alertType = 'RefundDone';
		this.refundAlert = true;
	}

	refund() {
		this.loading = true;
		this.paypmentService.refundPayment(this.selectedPayment).subscribe(
			response => {
				this.loading = false;
				if (response !== null) {
					this.error.emit(true);
				}else {
					this.showDoneAlert();
				}
			},
			err => {
				this.loading = false;
				this.error.emit(true);
			}
		);
	}

	logout() {
		this.userData.clearUser();
		this.helper.reRoute(['/home']);
	}
}
