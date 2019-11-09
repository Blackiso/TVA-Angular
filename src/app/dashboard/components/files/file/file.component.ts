import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FilesService } from '../../../services/files.service';
import { BillsService } from '../../../services/bills.service';
import { ClickAwayDirective } from '../../../../directives/click-away.directive';
import { HelperModule } from '../../../../modules/helper.module';
import { LocalStorageService } from '../../../../services/local-storage.service';

interface monthObjct {
	name:string,
	val:number,
	number:number
}

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnChanges {

	@Output() checking = new EventEmitter<any>();
	@Output() opend = new EventEmitter<any>();
	@Output() edit = new EventEmitter<any>();
	@Output() delete = new EventEmitter<any>();

	@Input() check:boolean;
	@Input() close:boolean;
	@Input() plane:boolean = false;
	@Input() data:any;

	_close:boolean = true;
	openning:boolean = false;
	moreInfo:boolean = false;
	monthsSelect:boolean = false;
	names:any ={
		quarterly : { 3: 'Trimestre 1', 6: 'Trimestre 2', 9: 'Trimestre 3', 12: 'Trimestre 4', },
		monthly : { 1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril', 5: 'Mai', 6: 'Juin', 7: 'Juillet', 8: 'Aout', 9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre' }
	};
	monthCurrentVal:monthObjct;
	loading:boolean = true;
	detailsSet:boolean = false;
	details:any = []; 
	filesTypes:any = {
		quarterly : 'Trimestriel',
		monthly : 'Mensuel'
	};
	selectTitle:any = {
		quarterly : 'Periode',
		monthly : 'Mois'
	};
	alertPopup:boolean = false;
	alertType:string;

	constructor(
		private helper:HelperModule, 
		private fileService:FilesService,
		private billsService:BillsService,
		private local:LocalStorageService
	) { }

	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		if (!!changes.close && this.openning) {
			this.openning = false;
		}else {
			this._close = true;
		}
	}

	openFile(e) {
		let currentTarget = e.target;
		let elem = currentTarget;
		while(elem.parentNode) {
			if (elem.classList.contains('dont-open')) {
				return;
			}
			elem = elem.parentNode;
		}
		this.openning = true;
		this.getDetails();
		this.opend.emit(null);
		this._close = !this._close;
	}

	getDetails() {
		if (this.detailsSet) {
			this.loading = false;
		}else {
			this.fileService.details(this.data.id).subscribe(
				response => {
					this.detailsSet = true;
					this.details = response.months;
					this.setDefault();
					this.loading = false;
				}
			);
		}
	}

	setDefault() {
		this.monthCurrentVal = {
			name : this.names[this.data.type][this.details[0].month],
			val : this.details[0].month,
			number : this.details[0].bills
		};
	}

	checkMe(e) {
		var obj = {
			id : this.data.id,
			val : e.currentTarget.checked
		};
		this.checking.emit(obj);
	}

	setMonth(e) {
		let elemnt = e.currentTarget;
		this.monthCurrentVal.name = elemnt.dataset.name;
		this.monthCurrentVal.number = elemnt.dataset.number;
		this.monthCurrentVal.val = elemnt.dataset.select;
		let childrens = elemnt.parentNode.children;
		for (let i = 0; i < childrens.length; i++) {
			childrens[i].classList.remove('selected-month');
		}
		elemnt.classList.add('selected-month');
	}

	setLastModified() {
		var companyId = this.local.getItem('companyId');
		var files = JSON.parse(this.local.getItem('files'));
		var compIndex;
		files.forEach((obj, i) => {
			if (obj.id == companyId) {
				compIndex = i;
			}
		});

		files[compIndex].files.forEach((file, i) => {
			if (file.id == this.data.id) {
				files[compIndex].files.splice(i, 1);
			}
		});

		if (files[compIndex].files.length < 5) {
			files[compIndex].files.push(this.data);
		}

		console.log(files);
		this.local.addItem('files', JSON.stringify(files));
	}

	editFile() {
		this.edit.emit(this.data);
	}

	deleteFile() {
		this.delete.emit(this.data.id);
	}

	submitFile(e) {
		e.preventDefault();
		this.setLastModified();
		this.helper.reRoute(['/dashboard', 'bills', this.data.id, this.monthCurrentVal.val]);
	}

	openPDF() {
		window.open(location.origin+"/api/download/"+this.data.id+"/"+this.monthCurrentVal.val+"/pdf");
	}

	openXML() {
		// window.open(location.origin+"/api/download/"+this.data.id+"/"+this.monthCurrentVal.val+"/xml");
		this.displayDownload();
	}

	downloadXML(name) {
		if (name == "" || name == true) {
			name = this.data.id+"-"+this.monthCurrentVal.val;
		}
		this.billsService.getXML(this.data.id, this.monthCurrentVal.val).subscribe(
			response => {
				var a = document.createElement('a');
		        var blob = new Blob([response], {type: "text/plain;charset=utf-8"});
            	var url = window.URL.createObjectURL(blob);
		        a.href = url;
		        a.download = name+'.xml';
		        document.body.append(a);
		        a.click();
		        a.remove();
		        window.URL.revokeObjectURL(url);
			}
		);
	}

	alertAnswer(e) {
		this[this.alertType+"Answer"](e);
	}

	xmlAnswer(e) {
		this.alertPopup = false;
		if (e) {
			this.downloadXML(e);
		}
	}

	displayDownload() {
		this.alertType = "xml";
		this.alertPopup = true;
	}
}
