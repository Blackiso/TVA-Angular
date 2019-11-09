import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { BillsService } from '../../dashboard/services/bills.service';
import { TauxValuesService } from '../../services/taux-values.service';
import { HelperModule } from '../../modules/helper.module';
import { BillsBasedComponent } from '../../abstract/bills-based/bills-based.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-bills',
  templateUrl: './add-bills.component.html',
  styleUrls: []
})
export class AddBillsComponent extends BillsBasedComponent {

	@Output() addBill = new EventEmitter<any>();
	@Output() close = new EventEmitter<any>();
	@Input() loading:boolean = false;

	suppliers:any = [];
	suggestion:boolean = false;
	suggestionDBS:boolean = false;
	lockedInputs:any = [];
	selectedndf:string = null;
	selectediff:string = null;
	selectedice:string = null;
	error:boolean = false;
	form:any;
	allInputs:any = [];
	lockAllCheck:boolean = false;
	lockAllCheckBtn:string = "VERROUILLER";
	selectFocus:boolean = false;
	errorInput:any = [];
	monthsLimit:any = {
		'01' : 31,
		'02' : 28,
		'03' : 31,
		'04' : 30,
		'05' : 31,
		'06' : 30,
		'07' : 31,
		'08' : 31,
		'09' : 30,
		'10' : 31,
		'11' : 30,
		'12' : 31 
	};
	ddf:any = null;
	ddp:any = null;

	typesOfTaux:any;
	SelectedTypeOfTaux:any;
	autoDb11:any = 140;
	autoTaux:any = 20;
	dbsList:any;
	selectedDbs:any = null;

	constructor(
		private helper:HelperModule, 
		private billsService:BillsService, 
		private changes:ChangeDetectorRef,
		private tauxServices:TauxValuesService
	) {
		super();
		this.typesOfTaux = this.tauxServices.tauxTypes;
		this.SelectedTypeOfTaux = this.typesOfTaux.T20;
		this.tTVA = 20;
	}

	tauxChange(value) {
		console.log('changing to', value);
		this.SelectedTypeOfTaux = this.typesOfTaux['T'+value];
		this.autoTaux = value;
		this.tTVA = value;
		this.calculate();
	}

	lockInput(e, name) {
		var linkedSupplier = ['ndf', 'iff', 'ice'];
		var removeIndexes = [];

		if (this.lockedInputs.includes(name)) {	

			this.lockedInputs.forEach((item, i) => {
				if (linkedSupplier.includes(name)) {
					if (linkedSupplier.includes(item)) {
						removeIndexes.push(i);
					}
				}else if (item == name) {
					this.lockedInputs.splice(i, 1);
				}
			});

			if (removeIndexes.length > 0) {
				removeIndexes.reverse();
				removeIndexes.forEach((indx, i) => {
					this.lockedInputs.splice(indx, 1);
				});
			}

			this.setLockCheck(false);
		}else {
			if (linkedSupplier.includes(name)) {
				this.lockedInputs = this.lockedInputs.concat(linkedSupplier);
			}else {
				this.lockedInputs.push(name);
			}
			
			if (this.lockedInputs.length == 12) {
				this.setLockCheck(true);
			}
		}
	}

	lockAll(e) {
		if (this.lockAllCheck) {
			this.lockedInputs = [];
			this.setLockCheck(false);
		}else {
			this.lockedInputs = ["nfa", "dbs", "iff", "tva", "tau", "ddp", "mdp", "ttc", "mht", "ice", "ndf", "ddf", "pro"];
			this.setLockCheck(true);
		}
	}

	setLockCheck(val) {
		if (val) {
			this.lockAllCheck = true;
			this.lockAllCheckBtn = "DÉVERROUILLER";
		}else {
			this.lockAllCheck = false;
			this.lockAllCheckBtn = "VERROUILLER";
		}
	}

	searchSuppliers(e) {
		var target = e.currentTarget;
		if (target.value.length > 1) {
			this.getSuppliers(target.value);
		}else {
			this.suggestion = false;
		}
	}

	searchDbs(val) {
		if (val.length > 1) {
			this.getDbs(val);
		}else {
			this.suggestionDBS = false;
		}
	}

	setSupplier(e) {
		var target = e.currentTarget;
		this.selectedndf = null;
		this.selectediff = null;
		this.selectedice = null;
		this.changes.detectChanges();
		this.selectedndf = target.dataset.ndf;
		this.selectediff = target.dataset.iff;
		this.selectedice = target.dataset.ice;
		this.suggestion = false;
	}

	setDbs(e) {
		var target = e.currentTarget;
		this.selectedDbs = null;
		this.autoDb11 = null;
		this.selectedDbs = null;
		this.changes.detectChanges();
		this.tauxChange(target.dataset.tau);
		this.autoDb11 = target.dataset.code;
		this.selectedDbs = target.dataset.dbs;
		this.suggestionDBS = false;
	}

	getSuppliers(keyword) {
		this.billsService.getSuppliers(keyword).subscribe(
			response => {
				this.suppliers = response;
				this.suggestion = true;
			}
		);
	}

	getDbs(keyword) {
		this.billsService.getDbs(keyword).subscribe(
			response => {
				this.dbsList = response;
				this.suggestionDBS = true;
			}
		);
	}

	addNewBill(e) {
		e.preventDefault();
		this.errorInput = [];
		this.error = false;
		this.form = this.helper.extractFormValues(e);
		var emptyInp = this.helper.emptyObject(this.form);
		if (emptyInp) {
			if (emptyInp !== 'pro') {
				console.log(emptyInp);
				this.errorInput.push(emptyInp);
				return;
			}
 		}

 		if (isNaN(this.form.ice) || this.form.ice.length > 15) {
 			this.errorInput.push('ice');
 			return;
 		}

 		if (isNaN(this.form.iff) || this.form.iff.length > 8) {
 			this.errorInput.push('iff');
 			return;
 		}

 		if (isNaN(this.form.tau)) {
 			this.errorInput.push('tau');
 			return;
 		}

 		if (isNaN(this.form.mht)) {
 			this.errorInput.push('mht');
 			return;
 		}

 		if (isNaN(this.form.pro) || this.form.pro == '' || this.form.pro > 100) {
 			this.form.pro = "100";
 		}
 		this.form.mht = parseFloat(this.form.mht).toFixed(2);
 		this.form.tau = parseFloat(this.form.tau).toFixed(2);
 		this.form.tva = parseFloat(this.form.tva).toFixed(2);
 		this.form.ttc = parseFloat(this.form.ttc).toFixed(2);
 		this.addBill.emit(this.form);
		this.clearInputs(e);
	}

	inputDBS(e) {
		var keywords = this.tauxServices.keywords;
		var outputs = this.tauxServices.outputs;

		for (var key in keywords) {
			if (keywords[key].some(function(v) { return e.currentTarget.value.indexOf(v) >= 0; })) {
			    this.tauxChange(outputs[key].taux);
				this.autoDb11 = outputs[key].db11;
			    break;
			}
		}
	}

	parseDate(e) {
		var target = e.currentTarget;
		var val = this.checkDate(target.value);
		if (!val) {
			this.errorInput.push(target.name);
			return;
		}else {
			target.value = val;
			this[target.name] = val;
			this.errorInput.forEach((inp, i) => {
				if (inp == target.name) {
					this.errorInput.splice(i, 1);
				}
			});
		}
		this.checkModePayment();
	}

	checkModePayment() {
		var mode = document.getElementById('mdp') as HTMLInputElement;
		if (mode.value == '1') {
			this.ddp = this.ddf;
		}else {
			this.ddp = null;
		}
	}

	checkDate(date) {
		var date = date.replace(/^\s*(.*\S)\s*$/, "$1");
		var splitDate;
		if (date.includes('-')) {
			splitDate = date.split('-');
		}else if (date.includes('/')) {
			splitDate = date.split('/');
		}else if (date.includes(' ')) {
			splitDate = date.split(' ');
		}else {
			return false;
		}
		
		if (splitDate.length >= 2) {
			if (typeof splitDate[2] == 'undefined') {
				var x = new Date();
				splitDate[2] = x.getFullYear().toString();
			}else if(splitDate[2].length == 2) {
				splitDate[2] = "20"+splitDate[2];
			}else if (splitDate[2].length !== 4) {
				return false;
			}

			splitDate.forEach((date, i) => {
				if (date.length == 1) {
					splitDate[i] = "0"+date;
				}
			});

			if (isNaN(splitDate[1]) || splitDate[1] > 12 || splitDate[1] < 0) {
				return false;
			}

			if (isNaN(splitDate[0]) || splitDate[0] > this.monthsLimit[splitDate[1]] || splitDate[0] < 0) {
				return false;
			}
		
			return splitDate.join('-');
		}else {
			return false;
		}
	}

	clearInputs(e) {
		var supplier = ['ndf', 'ice', 'iff'];
		if (this.allInputs.length == 0) this.setupInputs(e);
		
		this.allInputs.forEach(input => {
			if (!this.lockedInputs.includes(input.name)) {
				input.value = null;
				if (supplier.includes(input.name)) {
					this.selectedndf = null;
					this.selectedice = null;
					this.selectediff = null;
				}
				if (input.name == 'ddp') this.ddp = null;
				if (input.name == 'ddf') this.ddf = null;
			}
		});
	}

	setupInputs(e) {
		var elemnts = e.target.children;
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
