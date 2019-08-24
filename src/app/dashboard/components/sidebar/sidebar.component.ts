import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service'
import { UserDataService } from '../../../services/user-data.service'

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
		private dashboard:DashboardService
	) { }

	ngOnInit() {
		this.userName = this.userData.userName;
		this.companyName = this.dashboard.companyName;
		console.log(this.dashboard.companyName);
		var url = window.location.pathname.split('/');
		this.active = url[2] !== undefined ? url[2] : 'users';
	}

}
