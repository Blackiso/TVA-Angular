import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: []
})
export class AddComponent {

	@Input() config:any;
	@Input() title:any;
	@Input() error:boolean;
	@Input() loading:boolean = false;
	@Output() closePopup = new EventEmitter<boolean>();
	@Output() formSubmit = new EventEmitter<any>();
	email:string;
	emailPattern:string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
	focus:boolean = false;

	close() {
		this.closePopup.emit(true);
	}

	submitPopup(e) {
		e.preventDefault();
		this.formSubmit.emit(e);
	}

}
