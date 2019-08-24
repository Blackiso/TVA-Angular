import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
	openValue: any = new Subject();
	checkAll: any = new Subject();
	constructor() { }

	chnageOpenValue(val:boolean) {
		this.openValue.next();
	}

	watchOpenValue() {
		return this.openValue.asObservable();
	}

	checkAllF(val:boolean) {
		this.checkAll.next(val);
	}

	watchcheckAll() {
		return this.checkAll.asObservable();
	}
}
