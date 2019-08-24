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

	constructor() { }

	setUserAuth(data) {
		this.userAuth = true;
		this.userId = data.user_id;
		this.userName = data.name;
		this.userEmail = data.email;
		this.userType = data.type;
	}
}
