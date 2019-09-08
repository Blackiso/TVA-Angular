import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BillsService } from '../../dashboard/services/bills.service';
import { HelperModule } from '../../modules/helper.module';

@Component({
  selector: 'app-add-bills',
  templateUrl: './add-bills.component.html',
  styleUrls: []
})
export class AddBillsComponent {

	@Output() addBill = new EventEmitter<any>();
	@Output() close = new EventEmitter<any>();

	suppliers:any = [];
	suggestion:boolean = false;
	lockedInputs:any = [];
	selectedndf:string = null;
	selectediff:string = null;
	selectedice:string = null;
	error:boolean = false;
	form:any;
	allInputs:any = [];
	lockAllCheck:boolean = false;
	lockAllCheckBtn:string = "LOCK ALL";

	mHT:any = null;
	tTVA:any = null;
	mTVA:any = 0;
	mTTC:any = 0;

	constructor(private helper:HelperModule, private billsService:BillsService) { }

	calculate() {
		if (this.tTVA !== '' && this.tTVA !== 0 && this.tTVA !== null && this.mHT !== '' && this.mHT !== 0 && this.mHT !== null) {
			this.mHT =  this.checkFloat(this.mHT);
			this.tTVA = this.checkFloat(this.tTVA);
			this.mTVA = (this.mHT * (this.tTVA / 100)).toFixed(2);
			this.mTTC = (parseFloat(this.mTVA) + parseFloat(this.mHT)).toFixed(2);
		}
	}

	checkFloat(value) {
		value = value.toString();
		if (!isNaN(value) && value.indexOf('.') != -1 && value[value.indexOf('.')+1] !== undefined) {
			return parseFloat(value);
		}
		return value;
	}

	lockInput(e, name) {
		if (this.lockedInputs.includes(name)) {
			this.lockedInputs.forEach((item, i) => {
				if (item == name) {
					this.lockedInputs.splice(i, 1);
				}
			});
			this.unlock(e.currentTarget);
			this.setLockCheck(false);
		}else {
			this.lockedInputs.push(name);
			this.lock(e.currentTarget);
			if (this.lockedInputs.length == 12) {
				this.setLockCheck(true);
			}
		}
		console.log(this.lockedInputs);
	}

	lockAll(e) {
		if (this.lockAllCheck) {
			this.lockedInputs = [];
			this.setLockCheck(false);
		}else {
			this.lockedInputs = ["nfa", "dbs", "iff", "tva", "tau", "ddp", "mdp", "ttc", "mht", "ice", "ndf", "ddf"];
			this.setLockCheck(true);
		}

		var elems = Array.from(document.getElementsByClassName('lock'));
		elems.forEach(item => {
			if (this.lockAllCheck) {
				this.lock(item);
			}else {
				this.unlock(item)
			}
		});	
	}

	setLockCheck(val) {
		if (val) {
			this.lockAllCheck = true;
			this.lockAllCheckBtn = "UNLOCK ALL";
		}else {
			this.lockAllCheck = false;
			this.lockAllCheckBtn = "LOCK ALL";
		}
	}

	unlock(elem) {
		elem.classList.remove('locked');
		elem.classList.add('unlocked');
	}

	lock(elem) {
		elem.classList.remove('unlocked');
		elem.classList.add('locked');
	}

	searchSuppliers(e) {
		var target = e.currentTarget;
		if (target.value.length > 3) {
			this.getSuppliers(target.value);
		}else {
			this.suggestion = false;
		}
	}

	setSupplier(e) {
		var target = e.currentTarget;
		this.selectedndf = target.dataset.ndf
		this.selectediff = target.dataset.iff
		this.selectedice = target.dataset.ice
		this.suggestion = false;
	}

	getSuppliers(keyword) {
		this.billsService.getSuppliers(keyword).subscribe(
			response => {
				this.suppliers = response;
				this.suggestion = true;
			}
		);
	}

	addNewBill(e) {
		this.form = this.helper.extractFormValues(e);
		if (this.helper.emptyObject(this.form)) {
 			this.error = true;
 			return;
 		}
 		this.addBill.emit(this.form);
		this.clearInputs(e);
	}

	clearInputs(e) {
		if (this.allInputs.length == 0) {
			this.setupInputs(e);
		}
		this.allInputs.forEach(input => {
			if (!this.lockedInputs.includes(input.name)) {
				input.value = null;
			}
		});
	}

	setupInputs(e) {
		var elemnts = e.path[0].children;
		[...elemnts].forEach(elem => {this.getInputElem(elem)});
	}

	getInputElem(parent) {
		if (parent.nodeName == 'INPUT') {
			this.allInputs.push(parent);
				
		}else {
			parent = parent.children;
			[...parent].forEach(elem => {
				if (elem.nodeName !== 'INPUT') {
					this.getInputElem(elem);
				}else {
					this.allInputs.push(elem);
				}
			});
		}
	}

	closePopup() {
		this.close.emit(null);
	}

}
