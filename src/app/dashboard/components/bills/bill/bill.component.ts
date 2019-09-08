import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BillsService } from '../../../services/bills.service';
import { HelperModule } from '../../../../modules/helper.module';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['../bills.component.css']
})
export class BillComponent implements OnInit {

	@Input() data:any;
	@Output() copyBill = new EventEmitter<any>();

	billOpned:boolean = false;
	form:any;

	constructor(private helper:HelperModule, private billsService:BillsService) { }

	ngOnInit() {
	}

	editBill(e) {
		this.form = this.extractUpdate(this.helper.extractFormValues(e));
		if (Object.keys(this.form).length === 0 && this.form.constructor === Object) return;
		this.billsService.updateBill(this.form, this.data.id).subscribe(
			response => {
				if (response == null) {
					this.addUpdates();
				}
			}
		);
	}

	addUpdates() {
		for (let item in this.form) {
			console.log(item, this.data);
			this.data[item] = this.form[item];
		}
	}

	duplicateBill(e) {
		e.stopPropagation();
		var dataCopy = Object.assign({}, this.data);
		delete dataCopy.id;
		this.copyBill.emit(dataCopy);
	}

	blurInput(e) {
		e.currentTarget.blur();
	}

	extractUpdate(obj) {
		for (var item in obj) {
			if (obj[item] == "") delete obj[item];
			if (obj[item] == this.data[item]) delete obj[item];
		}
		return obj;
	}
}
