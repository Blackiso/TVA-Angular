import { Component, OnInit } from '@angular/core';
import { FilesService } from '../../../services/files.service';
import { ClickAwayDirective } from '../../../../directives/click-away.directive';

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
export class FileComponent implements OnInit {
	open_file:any = false;
	current:boolean = false;
	check:boolean = false;

	moreInfo:boolean = false;
	monthsSelect:boolean = false;

	monthCurrentVal:monthObjct = {
		name : "January",
		val : 1,
		number : 50
	};

	constructor(private fileService:FilesService) { }

	ngOnInit():void {
		this.fileService.watchOpenValue().subscribe(
			val => {
				if(!this.current) {
					this.open_file = val;
				}
				this.current = false;
			}
		);
		this.fileService.watchcheckAll().subscribe(
			val => {
				this.check = val;
			}
		);
	}

	openFile(e):void {
		let currentTarget = e.target;
		let elem = currentTarget;
		while(elem.parentNode) {
			if (elem.classList.contains('dont-open')) {
				return;
			}
			elem = elem.parentNode;
		}
		this.current = true;
		this.fileService.chnageOpenValue(false);
		this.open_file = !this.open_file;
	}

	checkFile(e):void {
		this.check = e.currentTarget.checked;
	}

	setMonth(e):void {
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

	submitFile(form):void {
		
	}

}
