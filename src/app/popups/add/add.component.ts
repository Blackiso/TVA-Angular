import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { HelperModule } from '../../modules/helper.module';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: []
})
export class AddComponent {

	@Input() config:any;
	@Input() xType:any;
	@Input() title:any;
	@Input() error:boolean;
	@Input() loading:boolean = false;
	@Input() errorInput:any = [];
	@Output() closePopup = new EventEmitter<boolean>();
	@Output() formSubmit = new EventEmitter<any>();
	email:string;
	emailPattern:string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
	focus:boolean = false;
	form:any;

	constructor(private helper:HelperModule) {}

	close() {
		this.closePopup.emit(true);
	}

	submitPopup(e) {
		e.preventDefault();
		this.form = this.helper.extractFormValues(e);
 		this.errorInput = [];
 		var inputError = this.helper.emptyObject(this.form);

 		this.config.forEach(inp => {
 			if (inputError == inp.name) {
 				if (!!inp.optional) {
 					inputError = false;
 				}
 			}
 		});

 		if (inputError) {
 			this.errorInput.push(inputError);
 			return;
 		}
		this.formSubmit.emit(this.form);
	}

}
