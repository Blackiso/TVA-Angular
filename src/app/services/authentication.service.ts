import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

	loginUrl:string = "/api/authentication/login";
	authUrl:string = "/api/authentication/authenticate";
	registerUrl:string = "/api/authentication/register";
	logoutUrl:string = "/api/authentication/logout";

	constructor(private http:HttpClient, private url:UrlsService) { }

	login(creds) {
		return this.http.post<any>(this.url.prefix+this.loginUrl, creds);
	}

	authenticate() {
		return this.http.get<any>(this.url.prefix+this.authUrl);
	}

	register(info) {
		return this.http.post<any>(this.url.prefix+this.registerUrl, info);
	}

	logout() {
		return this.http.post<any>(this.url.prefix+this.logoutUrl, {});
	}
}
