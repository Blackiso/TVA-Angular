import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: []
})
export class AlertComponent implements OnInit {

	@Output() answerEvent = new EventEmitter<boolean>();
	@Input() alertType:any;
	types:any = {
		delete : {
			title : "Delete selected item",
			msg : "Are you sure you want to delete the select items ?"
		},
		error : {
			title : "Request error",
			msg : "An error occurred, please try again!"
		}
	};
	currentType:any;

	ngOnInit() {
		this.currentType = this.types[this.alertType];
	}

	answer(x) {
		this.answerEvent.emit(x);
	}

}
