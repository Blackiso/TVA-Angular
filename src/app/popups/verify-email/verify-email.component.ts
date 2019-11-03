import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HelperModule } from '../../modules/helper.module';
import { AuthenticationService } from '../../services/authentication.service';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: []
})
export class VerifyEmailComponent implements OnInit {

	@Output() closePopup = new EventEmitter<boolean>();
	form:any;
	error:boolean = false;
	loading:boolean = false;

	constructor(
		private helper:HelperModule,
		private authSearvice:AuthenticationService,
		private userData:UserDataService
	) { }

	ngOnInit() {}

	submitPopup(e) {
		e.preventDefault();
		this.form = this.helper.extractFormValues(e);
		if (isNaN(this.form.code as any) || this.form.code == "") {
			this.error = true;
			return;
		}
		this.error = false;
		this.loading = true;
		this.authSearvice.verify(this.form.code).subscribe(
			response => {
				this.loading = false;
				if (!!response.error || response.verification == false) {
					this.error = true;
				}else {
					this.userData.setUserAuth(response);
					this.close();
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
				console.log('Erorr Sending Email From POPUP');
			},
			err => {
				console.log('Erorr Sending Email From POPUP');
			}
		);
	}

	close() {
		this.closePopup.emit(true);
	}
}
