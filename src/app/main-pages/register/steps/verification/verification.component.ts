import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['../../register.component.css']
})
export class VerificationComponent implements OnInit {

	@Output() next = new EventEmitter<boolean>();

	constructor() { }

	ngOnInit() {
	}

	verify() {
		this.nextStep();
	}

	nextStep() {
		this.next.emit(true);
	}

}
