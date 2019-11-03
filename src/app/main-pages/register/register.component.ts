import { Component } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { AuthenticationService } from '../../services/authentication.service'
import { HelperModule } from '../../modules/helper.module';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

	step:number = 1;
	logedIn:boolean = false;
	userEmail:string;
	images:any = ['undraw_profile_data_mk6k.svg', 'undraw_message_sent_1030.svg', 'undraw_savings_hjfl.svg', 'undraw_coolness_dtmq.svg'];

	constructor(
		private userData:UserDataService, 
		private authSearvice:AuthenticationService,
		private helper:HelperModule,
		private titleService: Title
	)  {
		this.setUser(true);
		this.titleService.setTitle("Paramanagers | Enregistrement");
	}

	setUser(x?) {
		if (this.userData.userType == "pending") {
			this.userEmail = this.userData.userEmail;
			this.logedIn = true;
			if (x) this.step = 3;
		}
	}

	nextStep() {
		this.setUser();
		this.step += 1;
	}

	stepBack() {
		this.step -= this.step !== 1 ? 1 : 0;
	}

	logout() {
		this.authSearvice.logout().subscribe(
			response => {
				if (response == null) {
					this.userData.clearUser();
					this.helper.reRoute(['/home']);
				}
			}
		);
	}
}
