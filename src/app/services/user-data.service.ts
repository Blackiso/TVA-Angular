import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

	runAuth:boolean = false;
	userAuth:boolean = false;
	userId:number;
	userName:string;
	userEmail:string;
	userType:string;
	active:boolean;

	constructor() { }

	setUserAuth(data) {
		this.userAuth = true;
		this.userId = data.user_id;
		this.userName = data.name;
		this.userEmail = data.email;
		this.userType = data.type;
		this.active = data.active;
	}

	clearUser() {
		this.runAuth = false;
		this.userAuth = false;
		this.userId = null;
		this.userName = null;
		this.userEmail = null;
		this.userType = null;
	}
}
