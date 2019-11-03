import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-capture-payment',
  templateUrl: './capture-payment.component.html',
  styleUrls: ['./capture-payment.component.css']
})
export class CapturePaymentComponent implements OnInit {

	constructor(private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
            window.opener.HandlePopupResult(params.token);
			window.close();
        });
	}

}
