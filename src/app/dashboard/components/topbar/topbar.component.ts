import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { UserDataService } from '../../../services/user-data.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: []
})
export class TopbarComponent implements OnInit {

	allowSearch:boolean = false;
	currentComponent:string;
	allowedComponents:any = ['files', 'bills'];
	translate:any = {
		files : "des dossiers",
		bills : "des factures",
	};
	verifyEmailPopup:boolean = false;
	alertPopup:boolean = false;
	alertType:string = "error";
	isVerified:boolean;
	contactPopup:boolean = false;

	constructor(
		private DashboardService:DashboardService,
		private userData:UserDataService,
		private authSearvice:AuthenticationService
	) {
		this.isVerified = this.userData.active;
	}

	ngOnInit() {
		this.DashboardService.currentComponentS.subscribe(
			component => {
				this.currentComponent = component;
				this.checkSearch();
			}
		);
	}

	checkSearch() {
		if (this.allowedComponents.includes(this.currentComponent)) {
			this.allowSearch = true;
		}else {
			this.allowSearch = false;
		}
	}

	searchKeyUp(e) {
		if (e.currentTarget.value == "") {
			this.DashboardService.setSearchValue("");
		}
	}

	search(e) {
		this.DashboardService.setSearchValue(e.currentTarget.value);
	}

	verifyEmail() {
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

	close() {
		this.verifyEmailPopup = false;
		this.isVerified = this.userData.active;
	}

	alertAnwser(e) {
		this.alertPopup = false;
	}

}
