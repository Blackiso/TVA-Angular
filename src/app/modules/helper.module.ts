import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var gtag;

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class HelperModule {

	inputs:any;
	analyticsRunning:boolean = false;

	constructor(private router:Router) {
		if (!Array.prototype.includes) {
		    Array.prototype.includes = function() {
		        'use strict';
		        return Array.prototype.indexOf.apply(this, arguments) !== -1;
		    };
		}
	}

	analyticsPageView() {
		if (!this.analyticsRunning) {
			this.analyticsRunning = true;

			const navEndEvents = this.router.events.pipe(
				filter(event => event instanceof NavigationEnd),
			);
			navEndEvents.subscribe((event: NavigationEnd) => {
				gtag('config', 'UA-150901101-1', {
					'page_path': event.urlAfterRedirects
				});
			});
		}
	}

	analyticsEvent(eventName) {
		gtag('event', eventName);
	}

	extractFormValues(FormEvent) {
		this.inputs = {};
		var elemnts = FormEvent.target.children;
		[...elemnts].forEach(elem => {this.getInputElem(elem)});
		return this.inputs;
	}

	getInputElem(parent) {
		if (parent.nodeName == 'INPUT' || parent.nodeName == 'SELECT' || parent.nodeName == 'TEXTAREA') {
			this.inputs[parent.name] = parent.value;
		}else {
			parent = parent.children;
			[...parent].forEach(elem => {
				if (elem.nodeName !== 'INPUT' || elem.nodeName !== 'SELECT' || parent.nodeName !== 'TEXTAREA') {
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

	isEmpty(obj) {
		if (obj == null) return true;
	    if (obj.length > 0)    return false;
	    if (obj.length === 0)  return true;
	    if (typeof obj !== "object") return true;
	    for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
	    }
	    return true;
	}

	emptyObject(obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (obj[key] == "" || obj[key] == " " || obj[key] == [] || obj[key] == null) {
					return key;
				}
			}else {
				return key;
			}
		}
		return false;
	}
}
