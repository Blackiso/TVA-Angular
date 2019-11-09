import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserDataService } from '../services/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

	constructor(
        private userData:UserDataService, 
        private router:Router
    ) {}

	canActivate() {
		if (this.userData.userType == 'user') {
			this.router.navigate(['/dashboard']);
			return false;
		}
		return true;
	}
}
