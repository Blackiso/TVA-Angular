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
		if (window.localStorage.getItem(id) !== undefined) {
			return true;
		}
		return false;
	}

	clear() {
		window.localStorage.clear();
	}
}
