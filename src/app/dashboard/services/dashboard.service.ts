import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

	constructor(private localStorage:LocalStorageService) {}

	companyId:string;
	companyName:string;

	companyName_$ = new Subject<any>();
	companyName$ = this.companyName_$.asObservable();

	currentComponentS = new Subject<any>();
	currentComponent = this.currentComponentS.asObservable();

	searchValueS = new Subject<any>();
	searchValue = this.searchValueS.asObservable();

	setCurruntComponent(name) {
		this.currentComponentS.next(name);
	}

	setName(name) {
		this.localStorage.addItem('companyName', name);
		this.companyName = name;
		this.companyName_$.next(name);
	}

	setSearchValue(keyword) {
		this.searchValueS.next(keyword);
	}

}
