import { Component, OnInit, EventEmitter, Output, NgZone } from '@angular/core';
import { UserDataService } from '../../../../services/user-data.service';
import { PaymentService } from '../../../../services/payment.service';
import { HelperModule } from '../../../../modules/helper.module';

declare global {
	interface Window {
		HandlePopupResult:any;
	}
}

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['../../register.component.css']
})
export class PlansComponent implements OnInit {

	@Output() next = new EventEmitter<boolean>();
	loading:boolean = false;
	referenceId:string = 'premium_account_plan';
	payment:any;
	win:any;
	capturing:boolean = false;

	constructor(
		private ngZone: NgZone, 
		private paymentService:PaymentService, 
		private userData:UserDataService,
		private helper:HelperModule
	) { }

	ngOnInit() {
		window.HandlePopupResult = (x) => this.publicFunc(x);
	}

	ngOnDestroy() {
		window.HandlePopupResult = null;
	}

	process() {
		this.loading = true;
		var months = document.getElementById('months') as HTMLInputElement;
		this.paymentService.createPayment(this.referenceId, months.value).subscribe(
			response => {
				console.log(response);
				this.payment = response;
				this.win = this.PopupCenter(response.approve, 'window', 500, 600);
				this.listenToWindow();
			}
		);
	}

	publicFunc(token) {
		this.ngZone.run(() => {
			this.getToken(token);
		});
	}

	getToken(token) {
		if (token == this.payment.id) {
			this.capturing = true;
			this.paymentService.capturePayment(token).subscribe(
				response => {
					this.loading = false;
					this.capturing = false;
					this.userData.setUserAuth(response);
					this.nextStep();
				}
			);
		}
	}

	listenToWindow() {
		var interval = setInterval(()=> {
			if (this.win && this.win.closed) {
				clearInterval(interval);
				if (!this.capturing) this.loading = false;
				this.sendClick('paypal_window_closed');
			}
		}, 1000);
	}

	nextStep() {
		this.sendClick('paypal_payment_done');
		this.next.emit(true);
	}

	PopupCenter(url, title, w, h) {
	    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
	    var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

	    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
	    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

	    var systemZoom = width / window.screen.availWidth;
		var left = (width - w) / 2 / systemZoom + dualScreenLeft
		var top = (height - h) / 2 / systemZoom + dualScreenTop
	    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
	    if (window.focus) newWindow.focus();
	    return newWindow;
	}

	sendClick(name) {
		this.helper.analyticsEvent(name);
	}
}
