import { Component } from '@angular/core';
import { HelperModule } from '../../modules/helper.module';
import { AuthenticationService } from '../../services/authentication.service';
import { UserDataService } from '../../services/user-data.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

	email:string;
	password:string;
	form:any;
	emailPattern:string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
	loginError:boolean = false;
	loadingBtn:boolean = false;
	alert:boolean = false;
	alertType:string = "email";

	constructor(
		private helper:HelperModule,
		private authentication:AuthenticationService,
		private userData:UserDataService,
		private titleService: Title
	) {
		this.titleService.setTitle("Paramanagers | S'identifier");
	}

	loginUser(e) {
		e.preventDefault();
		if (this.loadingBtn) return;
		
		this.loadingBtn = true;
		this.form = this.helper.extractFormValues(e);

		if (this.checkForm()) {
			this.loadingBtn = false;
			this.loginError = true;
			return;
		}

		this.authentication.login(this.form)
			.subscribe(
				response => {
					this.loadingBtn = false;
					if (response.error) {
						this.loginError = true;
					}else {
						this.loginError = false;
						this.userData.setUserAuth(response);
						this.sendClick('user_loggedIn');
						this.helper.reRoute(['/companies']);
					}
				},
				err => {
					this.loginError = true;
					this.loadingBtn = false;
				}
			);
	}

	checkForm() {
		if (this.helper.emptyObject(this.form)) {
			return true;
		}
		return false;
	}

	sendResetEmail(email) {
		this.authentication.sendReset(email).subscribe(
			response => {
				if (response !== null) {
					this.displayError();
				}else {
					this.displayEmailSent();
				}
			},
			err => {
				this.displayError();
			}
		);
	}

	alertAnwser(e) {
		this.alert = false;
		if (e) {
			if (this.alertType == "email") this.sendResetEmail(e);
		}
	}

	displayEmailAlert() {
		this.alertType = "email";
		this.alert = true;
	}

	displayError() {
		this.alertType = "error";
		this.alert = true;
	}

	displayEmailSent() {
		this.alertType = "emailSent";
		this.alert = true;
	}

	sendClick(name) {
		this.helper.analyticsEvent(name);
	}
}
