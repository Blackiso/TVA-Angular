import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {

	local:boolean = true;
	prefix:string; 

	constructor() { 
		if (this.local) {
			this.prefix = "";
		}else {
			this.prefix = "http://tva-api.byethost7.com";
		}
	}
}
