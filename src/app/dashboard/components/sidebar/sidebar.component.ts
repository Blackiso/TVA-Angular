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

	constructor(
		private userData:UserDataService,
		private dashboard:DashboardService,
		private authSearvice:AuthenticationService,
		private helper:HelperModule
	) { }

	ngOnInit() {
		this.userName = this.userData.userName;
		this.companyName = this.dashboard.companyName;
		
		var url = window.location.pathname.split('/');
		this.active = url[2] !== undefined ? url[2] : 'files';
	}

	logout() {
		this.authSearvice.logout().subscribe(
			response => {
				if (response == null) {
					this.userData.userAuth = false;
					this.userData.runAuth = false;
					this.helper.reRoute(['/home']);
				}
			}
		);
	}

}
