import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

	addItem(id, value) {
		return window.localStorage.setItem(id, value);
	}

	getItem(id) {
		return window.localStorage.getItem(id);
	}

	deleteItem(id) {
		return window.localStorage.removeItem(id);
	}

	checkItem(id) {
		var check = window.localStorage.getItem(id);
		if (check === null) {
			return false;
		}
		return true;
	}

	clear() {
		window.localStorage.clear();
	}
}
