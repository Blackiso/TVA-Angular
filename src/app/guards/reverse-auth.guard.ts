import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { AuthenticationService } from '../services/authentication.service';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReverseAuthGuard implements CanActivate {

    constructor(
        private userData:UserDataService, 
        private router:Router,
        private auth:AuthenticationService
    ) {}

    canActivate() {
        if (this.userData.runAuth) {
            if (this.userData.userAuth) {
                this.router.navigate(['/companies']);
                return false;
            }else {
                return true;
            }
        }else {
            this.userData.runAuth = true;
            return this.auth.authenticate().pipe(
                map(data => {
                    this.userData.setUserAuth(data);
                    this.router.navigate(['/companies']);
                    return false;
                }),
                catchError(err => { 
                    return of(true);
                })
            );
        }
    }
}
