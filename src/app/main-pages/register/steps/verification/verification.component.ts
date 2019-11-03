import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HelperModule } from '../../../../modules/helper.module';
import { AuthenticationService } from '../../../../services/authentication.service';
import { UserDataService } from '../../../../services/user-data.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['../../register.component.css']
})
export class VerificationComponent implements OnInit {

	@Output() next = new EventEmitter<boolean>();
	block:boolean = true;
	loading:boolean = false;
	done:boolean = false;
	error:boolean = false;
	sent:boolean = false;
	userEmail:string;
	alertPopup:boolean = false;
	alertType:string = "error";
	contactPopup:boolean = false;

	constructor(
		private userData:UserDataService, 
		private authSearvice:AuthenticationService,
		private helper:HelperModule
	) {
		this.userEmail = this.userData.userEmail;
	}

	ngOnInit() {
		this.sendEmail();
	}

	verify() {
		var code = document.getElementById('code') as HTMLInputElement;
		if (isNaN(code.value as any) || code.value == "") {
			this.error = true;
			return;
		}
		this.error = false;
		this.loading = true;
		this.authSearvice.verify(code.value).subscribe(
			response => {
				this.loading = false;
				if (!!response.error || response.verification == false) {
					this.error = true;
				}else {
					this.userData.setUserAuth(response);
					this.done = true;
					this.block = false;
				}
			},
			err => {
				this.loading = false;
				this.error = true;
			}
		);
	}

	sendEmail() {
		this.authSearvice.send().subscribe(
			response => {
				if (response !== null) {
					this.alertPopup = true;
				}else {
					this.sent = true;
					setTimeout(() => {
						this.sent = false;
					}, 3000);
				}
			},
			err => {
				this.alertPopup = true;
			}
		);
	}

	contact() {
		this.contactPopup = true;
	}

	alertAnwser(e) {
		this.alertPopup = false;
	}

	nextStep() {
		if (this.done) {
			this.next.emit(true);
		}
	}

}
