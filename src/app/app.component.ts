import { Component, OnInit } from '@angular/core';
import { HelperModule } from './modules/helper.module';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: []
})
export class AppComponent implements OnInit { 

	constructor(
		private helper:HelperModule
	) { 
		if (!Array.prototype.includes) {
		    Array.prototype.includes = function() {
		        'use strict';
		        return Array.prototype.indexOf.apply(this, arguments) !== -1;
		    };
		}
		this.helper.analyticsPageView();
	}

	ngOnInit() {

	}

}
