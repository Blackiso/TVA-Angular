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
	sendEmailUrl:string = "/api/account/email/send";
	verifyEmailUrl:string = "/api/account/email/verify";
	resetURL:string = "/api/account/reset";

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

	send() {
		return this.http.post<any>(this.url.prefix+this.sendEmailUrl, {});
	}

	verify(code) {
		return this.http.post<any>(this.url.prefix+this.verifyEmailUrl, {code : code});
	}

	sendReset(email) {
		return this.http.post<any>(this.url.prefix+this.resetURL, {email : email});
	}

	reeset(data) {
		return this.http.patch<any>(this.url.prefix+this.resetURL, data);
	}
}
