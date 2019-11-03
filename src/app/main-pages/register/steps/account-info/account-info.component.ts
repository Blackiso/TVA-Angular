import { Component, EventEmitter, Output } from '@angular/core';
import { HelperModule } from '../../../../modules/helper.module';
import { AuthenticationService } from '../../../../services/authentication.service';
import { UserDataService } from '../../../../services/user-data.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['../../register.component.css']
})
export class AccountInfoComponent {

	@Output() next = new EventEmitter<boolean>();
	name:string;
	lname:string;
	password:string;
	repassword:string;
	email:string;
	defaultError:string = "Register error please try again!";
	emailPattern:string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
	registerError:boolean = false;
	registerErrorMsg:string;
	loadingBtn:boolean = false;
	form:any;

	constructor(
		private helper:HelperModule,
		private authentication:AuthenticationService,
		private userData:UserDataService
	) { }

	register(e) {
		e.preventDefault();
		this.registerError = false;
		this.registerErrorMsg = "";
		if (this.loadingBtn) return;
		this.loadingBtn = true;

		this.form = this.helper.extractFormValues(e);
		if(this.checkForm() || !this.checkPassword()) {
			this.loadingBtn = false;
			this.registerError = true;
			return;
		}

		this.form.name += " "+this.form.lname;
		delete this.form.lname;

		this.authentication.register(this.form)
			.subscribe(
				response => {
					this.loadingBtn = false;
					if (response.error) {
						if (response.code == null) {
							this.registerErrorMsg = response.error;
						}
						this.registerError = true;
					}else {
						this.registerError = false;
						this.userData.setUserAuth(response);
						this.nextStep();
					}
				},
				err => {
					this.registerError = true;
					this.loadingBtn = false;
				}
			);
	}

	checkPassword() {
		if (this.form.password == this.form.repassword) {
			delete this.form.repassword;
			return true;
		}else {
			this.registerErrorMsg = "Passwords not matching";
			return false;
		}
	}

	checkForm() {
		if (this.helper.emptyObject(this.form)) {
			return true;
		}
		return false;
	}

	nextStep() {
		this.sendClick('user_registered');
		this.next.emit(true);
	}

	sendClick(name) {
		this.helper.analyticsEvent(name);
	}
}
