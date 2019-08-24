import { Component } from '@angular/core';
import { HelperModule } from '../../modules/helper.module';
import { AuthenticationService } from '../../services/authentication.service';
import { UserDataService } from '../../services/user-data.service';

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

	constructor(
		private helper:HelperModule,
		private authentication:AuthenticationService,
		private userData:UserDataService
	) { }

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

}
