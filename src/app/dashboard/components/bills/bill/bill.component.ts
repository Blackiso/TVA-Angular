import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { BillsService } from '../../../services/bills.service';
import { HelperModule } from '../../../../modules/helper.module';
import { BillsBasedComponent } from '../../../../abstract/bills-based/bills-based.component';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['../bills.component.css']
})
export class BillComponent extends BillsBasedComponent implements OnInit {

	@Input() data:any;
	@Input() check:boolean;
	@Input() closeMe:boolean;
	@Output() closeAll = new EventEmitter<any>();
	@Output() copyBill = new EventEmitter<any>();
	@Output() checking = new EventEmitter<any>();
	@Output() delete = new EventEmitter<any>();

	paymentMode:any = ['Espèce', 'Cheque', 'Prélèvement', 'Virement', 'Effet', 'Compensation', 'Autres'];
	billOpned:boolean = false;
	opening:boolean = false;
	form:any;

	constructor(private helper:HelperModule, private billsService:BillsService) {
		super();
	}

	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		if (!!changes.closeMe && this.opening) {
			this.opening = false;
		}else {
			this.billOpned = false;
		}
	}

	ngOnInit() {
		this.mHT = this.data.mht = this.data.mht.toFixed(2);
		this.tTVA = this.data.tau = this.data.tau.toFixed(2);
		this.mTVA = this.data.tva = this.data.tva.toFixed(2);
		this.mTTC = this.data.ttc = this.data.ttc.toFixed(2); 
	}

	toggleBill() {
		this.opening = true;
		this.billOpned = !this.billOpned;
		if (this.billOpned) {
			this.closeAll.emit(true);
		}
	}

	editBill(e) {
		e.preventDefault();
		this.form = this.extractUpdate(this.helper.extractFormValues(e));
		if (Object.keys(this.form).length === 0 && this.form.constructor === Object) return;
		var zero = ['mht', 'tau', 'tva', 'ttc'];

		if (this.form.hasOwnProperty('ice')) {
			if (isNaN(this.form.ice) || this.form.ice.length !== 15) return;
		}
 		if (this.form.hasOwnProperty('iff')) {
 			if (isNaN(this.form.iff) || this.form.iff.length > 8 || this.form.iff.length < 6) return;
 		}
 		if (this.form.hasOwnProperty('tau')) {
 			if (isNaN(this.form.tau)) return;
 		}
 		if (this.form.hasOwnProperty('mht')) {
 			if (isNaN(this.form.mht)) return;
 		}

		for (var key in this.form) {
			if (zero.includes(key)) {
				this.form[key] = parseFloat(this.form[key]).toFixed(2);
			}
		}

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
			this.data[item] = this.form[item];
		}
		this.mHT = this.data.mht;
		this.tTVA = this.data.tau;
		this.mTVA = this.data.tva;
		this.mTTC = this.data.ttc;
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

	submitForm(e) {
		var btn = document.getElementById(this.data.id);
		btn.click();
		this.blurInput(e);
	}

	checkMe(e) {
		var obj = {
			id : this.data.id,
			val : e.currentTarget.checked
		};
		this.checking.emit(obj);
	}

	deleteMe() {
		this.delete.emit(this.data.id);
	}
}
