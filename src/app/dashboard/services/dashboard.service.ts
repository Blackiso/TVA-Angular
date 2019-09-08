import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

	companyId:string;
	companyName:string;

	currentComponentS = new Subject<any>();
	currentComponent = this.currentComponentS.asObservable();

	searchValueS = new Subject<any>();
	searchValue = this.searchValueS.asObservable();

	setCurruntComponent(name) {
		this.currentComponentS.next(name);
	}

	setSearchValue(keyword) {
		this.searchValueS.next(keyword);
	}

}
