import { Component, OnInit } from '@angular/core';
import { HelperModule } from '../../modules/helper.module';
import { AuthenticationService } from '../../services/authentication.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

	password:string;
	repassword:string;
	bigError = false;
	params:any;
	allowedKeys:any = ['key', 'cts', 'email'];
	form:any;
	loadingBtn:boolean = false;
	error:boolean = false;

	constructor(
		private helper:HelperModule,
		private authentication:AuthenticationService,
		private titleService: Title,
		private route: ActivatedRoute
	) {
		this.titleService.setTitle("Paramanagers | Réinitialiser le mot de passe");
		this.route.queryParams.subscribe(params => {
	        this.params = params;
	    });
	}

	ngOnInit() {
		var i = 0;
		for (let key in this.params) {
			i++;
			if (!this.allowedKeys.includes(key)) {
				this.bigError = true;
			}
		}
		if (i !== this.allowedKeys.length) this.bigError = true;
	}

	resetPassword(e) {
		e.preventDefault();
		this.loadingBtn = true;
		this.error = false;
		this.form = this.helper.extractFormValues(e);
		if (this.form.password == "" || this.form.repassword == "") {
			this.error = true;
			this.loadingBtn = false;
			return;
		}
		if (this.form.password !== this.form.repassword) {
			this.error = true;
			this.loadingBtn = false;
			return;
		}

		var data = Object.assign({}, this.params);
		data.password = this.form.password;
		this.authentication.reeset(data).subscribe(
			response => {
				this.loadingBtn = false;
				if (response !== null) {
					this.bigError = true;
				}else {
					this.helper.reRoute(['login']);
				}
			},
			err => {
				this.loadingBtn = false;
				this.bigError = true;
			}
		);
	}

}
