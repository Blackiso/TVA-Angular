import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FilesService } from '../../../services/files.service';
import { ClickAwayDirective } from '../../../../directives/click-away.directive';
import { HelperModule } from '../../../../modules/helper.module';

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

	@Output() checked = new EventEmitter<any>();
	@Output() opend = new EventEmitter<any>();
	@Output() edit = new EventEmitter<any>();
	@Output() delete = new EventEmitter<any>();

	@Input() check:boolean;
	@Input() close:boolean;
	@Input() data:any;

	_close:boolean = true;
	openning:boolean = false;
	moreInfo:boolean = false;
	monthsSelect:boolean = false;
	names:any = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
	monthCurrentVal:monthObjct;
	loading:boolean = true;
	detailsSet:boolean = false;
	details:any = []; 

	constructor(private helper:HelperModule, private fileService:FilesService) { }

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
			name : this.names[this.details[0].month-1],
			val : this.details[0].month,
			number : this.details[0].bills
		};
	}

	checkFile(e) {
		this.check = e.currentTarget.checked;
		var emit = {
			id : this.data.id,
			check : this.check
		};
		this.checked.emit(emit);
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

	editFile() {
		this.edit.emit(this.data);
	}

	deleteFile() {
		this.delete.emit([this.data.id]);
	}

	submitFile() {
		this.helper.reRoute(['/dashboard', 'bills', this.data.id, this.monthCurrentVal.val]);
	}
}
