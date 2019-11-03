import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service'
import { UserDataService } from '../../../services/user-data.service'
import { AuthenticationService } from '../../../services/authentication.service'
import { HelperModule } from '../../../modules/helper.module';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class SidebarComponent implements OnInit {

	activeClass:string = "active-menu-item";
	active:string;
	userName:string;
	userType:string;
	companyName:string;
	isUser:boolean;

	constructor(
		public userData:UserDataService,
		private dashboard:DashboardService,
		private authSearvice:AuthenticationService,
		private helper:HelperModule
	) {
		this.isUser = this.userData.userType == 'user' ? true : false;
	}

	ngOnInit() {
		this.companyName = this.dashboard.companyName;
		this.dashboard.companyName$.subscribe(
			name => {
				this.companyName = name;
			}
		);
		
		this.dashboard.currentComponentS.subscribe(
			component => {
				this.active = component;
			}
		);
	}

	logout() {
		this.authSearvice.logout().subscribe(
			response => {
				if (response == null) {
					this.userData.clearUser();
					this.sendClick('user_loggedOut_dashboard');
					this.helper.reRoute(['/home']);
				}
			}
		);
	}

	sendClick(name) {
		this.helper.analyticsEvent(name);
	}

}
