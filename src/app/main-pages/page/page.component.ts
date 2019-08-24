import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

	email:string;
	name:string;
	type:string;

	constructor(
		private userData:UserDataService
	) { }

	ngOnInit() {
		this.email = this.userData.userEmail;
		this.name = this.userData.userName;
		this.type = this.userData.userType;
	}

}
