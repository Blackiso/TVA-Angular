import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['../../register.component.css']
})
export class PlansComponent implements OnInit {

	@Output() next = new EventEmitter<boolean>();

	constructor() { }

	ngOnInit() {
	}

	process() {
		this.nextStep();
	}

	nextStep() {
		this.next.emit(true);
	}

}
