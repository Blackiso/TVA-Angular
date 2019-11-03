import { Component, OnInit, Output, EventEmitter, SimpleChange, Input } from '@angular/core';
import { HelperModule } from '../../../../modules/helper.module';
import { UserDataService } from '../../../../services/user-data.service';
import { AccountService } from '../../../services/account.service';
import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['../settings.component.css']
})
export class AccountComponent implements OnInit {

	@Input() password:string;
	@Output() error = new EventEmitter<any>();
	@Output() getPassword = new EventEmitter<any>();
	errorInputs:any = [];
	data:any = {};
	form:any;
	loading:boolean = false;
	userType:string;
	paymentDetails:boolean = false;
	paymentEnd:string;
	paymentLeft:number;
	paymentStart:string;
	paymentDuration:number;
	done:boolean = false;
	verifyEmailPopup:boolean = false;
	alertPopup:boolean = false;
	alertType:string = "error";

	constructor(
		private userData:UserDataService, 
		private helper:HelperModule,
		private accountService:AccountService,
		private authSearvice:AuthenticationService
	) {
		this.data.name = this.userData.userName;
		this.data.email = this.userData.userEmail;
		this.data.password = "XXXXXXXXXXXXXX";
		this.data.repassword = "XXXXXXXXXXXXXX";
		this.data.language = "";
		this.userType = this.userData.userType;
	}

	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		if (!!changes.password) {
			if (changes.password.currentValue !== undefined) this.passwordAccuired(changes.password.currentValue);
		}
	}

	ngOnInit() {
		this.getAccountDetails();
	}

	getAccountDetails() {
		this.accountService.accountDetails().subscribe(
			response => {
				if (!!response.error) {
					this.error.emit(true);
				}else {
					this.displayPyamentDetails(response);
				}
			},
			err => {
				this.error.emit(true);
			}
		);
	}

	displayPyamentDetails(data) {
		this.paymentEnd = data.expire_date;
		this.paymentLeft = data.time_left;
		this.paymentStart = data.start_date;
		this.paymentDuration = data.duration;
		this.paymentDetails = true;
	}

	formSubmit(e) {
		this.errorInputs = [];
		this.form = this.extractUpdate(this.helper.extractFormValues(e));

		if (!!this.form.email) {
			if (!this.validateEmail(this.form.email)) {
				this.errorInputs.push('email');
				return;
			}else {
				this.removeItemArray(this.errorInputs, 'email');
			}
		}

		if (!!this.form.password) {
			if (this.form.password !== this.form.repassword) {
				this.errorInputs.push('password');
				return;
			}else {
				this.form.new_password = this.form.password;
				delete this.form.password;
				this.removeItemArray(this.errorInputs, 'password');
			}
		}
		delete this.form.repassword;
		if (this.helper.isEmpty(this.form)) return;
		this.getCurrentPassword();
	}

	getCurrentPassword() {
		if (this.password !== undefined) {
			this.passwordAccuired(this.password);
		}else {
			this.getPassword.emit(true);
		}
	}

	passwordAccuired(e) {
		this.form.password = e;
		this.updateAcount();
	}

	updateAcount() {
		this.loading = true;
		this.accountService.updateAccount(this.form).subscribe(
			response => {
				this.loading = false;
				if (response !== null) {
					this.error.emit(true);
					this.password = undefined;
				}else {
					this.updateDone();
					this.setNewdetails();
				}
			},
			err => {
				this.loading = false;
				this.error.emit(true);
				this.password = undefined;
			}
		);
	}

	updateDone() {
		this.done = true;
		setTimeout(() => {
			this.done = false;
		}, 3000);
	}

	setNewdetails() { 
		if (!!this.form.email) {
			this.userData.userEmail = this.form.email;
			this.data.email = this.form.email;
			this.sendEmailVerification();
		}
		if (!!this.form.name) {
			this.data.name = this.form.name;
			this.userData.userName = this.form.name;
		}
		if (!!this.form.new_password) {
			this.password = undefined;
			this.data.password = this.form.new_password;
			this.data.repassword = this.form.new_password;
		}
	}

	sendEmailVerification() {
		this.verifyEmailPopup = true;
		this.authSearvice.send().subscribe(
			response => {
				if (response !== null) {
					this.alertPopup = true;
				}
			},
			err => {
				this.alertPopup = true;
			}
		);
	}

	extractUpdate(obj) {
		for (var item in obj) {
			if (obj[item] == "" || obj[item] == " ") delete obj[item];
			if (item !== 'repassword') {
				if (obj[item] == this.data[item]) delete obj[item];
			}
		}
		return obj;
	}

	removeItemArray(array, name) {
		array.forEach((x, i) => {
			console.log(name, x, i);
			if (x == name) {
				array.splice(i, 1);
			}
		});
	}

	alertAnwser(e) {
		this.alertPopup = false;
	}

	validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(String(email).toLowerCase());
	}
}
