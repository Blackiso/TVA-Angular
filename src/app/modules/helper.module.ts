import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class HelperModule {

	inputs:any;

	constructor(private router:Router) {}

	extractFormValues(FormEvent) {
		this.inputs = {};
		var elemnts = FormEvent.path[0].children;
		[...elemnts].forEach(elem => {this.getInputElem(elem)});
		return this.inputs;
	}

	getInputElem(parent) {
		if (parent.nodeName == 'INPUT' || parent.nodeName == 'SELECT') {
			this.inputs[parent.name] = parent.value;
		}else {
			parent = parent.children;
			[...parent].forEach(elem => {
				if (elem.nodeName !== 'INPUT' || elem.nodeName !== 'SELECT') {
					this.getInputElem(elem);
				}else {
					this.inputs[elem.name] = elem.value;
				}
			});
		}
	}

	reRoute(route) {
		this.router.navigate(route);
	}

	emptyObject(obj) {
		var empty = false;
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (obj[key] == "" || obj[key] == " " || obj[key] == [] || obj[key] == null) {
					empty = true;
				}else {
					empty = false;
				}
			}else {
				return true;
			}
		}
		return empty;
	}
}
