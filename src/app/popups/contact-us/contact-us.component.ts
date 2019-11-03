import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HelperModule } from '../../modules/helper.module';
import { AccountService } from '../../dashboard/services/account.service';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: []
})
export class ContactUsComponent implements OnInit {

	@Output() closePopup = new EventEmitter<boolean>();

	email:string | null = null;
	name:string | null = null;
	lname:string | null = null;
	form:any;
	loading:boolean = false;
	inputError:any = [];
	error:boolean = false;
	done:boolean = false;

	constructor(
		private helper:HelperModule,
		private accountService:AccountService,
		private userData:UserDataService
	) { }

	ngOnInit() {
		if (this.userData.userAuth) {
			var fullName = this.userData.userName.split(' ');
			this.email = this.userData.userEmail;
			this.name = fullName[0];
			fullName.shift();
			this.lname = fullName.join(' ');
		}
	}

	submitPopup(e) {
		e.preventDefault();
		this.error = false;
		this.inputError = [];
		this.form = this.helper.extractFormValues(e);
		var checker = this.helper.emptyObject(this.form);
		if (checker) {
			this.inputError.push(checker);
			return;
		}
		this.form.name += " "+this.form.lname;
		delete this.form.lname;
		this.loading = true;
		this.accountService.support(this.form).subscribe(
			response => {
				this.loading = false;
				if (response !== null) {
					this.error = true;
				}else {
					this.done = true;
				}
			},
			err => {
				this.loading = false;
				this.error = true;
			}
		);
	}

	close() {
		this.closePopup.emit(true);
	}

}
