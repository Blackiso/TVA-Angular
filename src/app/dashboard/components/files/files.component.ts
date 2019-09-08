import { Component, OnInit, HostListener } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { DashboardService } from '../../services/dashboard.service';
import { HelperModule } from '../../../modules/helper.module';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

	files:any = [];
	checkAll:boolean = false;
	closeAll:boolean = false;
	deleteBtn:boolean = false;
	checkedFiles:any = [];
	companyId:any;
	addNew:boolean = false;
	addNewConfig:any = [
		{
			name : 'file_name',
			placeholder : 'Your file name',
			title : 'Name'
		},
		{
			name : 'type',
			placeholder : 'Type of file',
			title : 'Type',
			type : 'select',
			options : [
				{
					name : 'Quarterly',
					value : 'quarterly'
				},
				{
					name : 'Monthly',
					value : 'monthly'
				}
			]
		},
		{
			name : 'year',
			placeholder : 'Year of creation',
			title : 'Year'
		}
	];
	popupError:boolean = false;
	popupTiltle:string = "Create New File";
	popupLoading:boolean = false;
	form:any;
	scrollCallBack:any;
	loading:boolean = false;
	morePages:boolean = true;
	page:boolean = false;
	editPopupConfig:any;
	editPopup:boolean = false;
	editPopupTiltle:string = "Edit File";
	fileToEdit:any;
	alertPopup:boolean = false;
	alertType:string = "error";
	tempId:any;
	currentFilesAll:boolean = true;

	constructor(
		private helper:HelperModule,
		private fileService:FilesService,
		private DashboardService:DashboardService
	) {
		this.companyId = this.DashboardService.companyId;
		this.scrollCallBack = this.loadPages.bind(this);
	}

	ngOnInit() {
		this.DashboardService.setCurruntComponent('files');
		this.getAllFiles();
		this.DashboardService.searchValue.subscribe(
			keyword => {
				if (keyword == "") {
					if (!this.currentFilesAll) {
						this.currentFilesAll = true;
						this.getAllFiles();
					}
				}else {
					this.currentFilesAll = false;
					this.searchFiles(keyword);
				}
			}
		);
	}

	searchFiles(keyword) {
		if (!this.loading) {
			this.loading = true;
			this.fileService.searchFor(keyword, this.DashboardService.companyId).subscribe(
				response => {
					this.loading = false;
					if (!!response.error) {
						this.displayError();
					}else {
						this.files = response;
					}
				},
				err => {
					this.displayError();
				}
			);
		}
	}

	loadPages() {
		if (!this.loading && this.morePages) {
			this.page = true;
			var lastItem = this.files.slice(-1)[0].id;
			this.getAllFiles(lastItem);
		}
	}

	getAllFiles(lastItem?) {
		this.loading = true;
		lastItem = !!lastItem ? lastItem : false;
		this.fileService.getAll(this.companyId, lastItem).subscribe(
			response => {
				this.loading = false;
				if (response.error) {
					this.page = false;
					this.displayError();
				}else {
					this.files = !this.page ? response : this.files.concat(response);
					this.page = false;
					if (response.length < 20) this.morePages = false;
				}
			},
			err => {
				this.loading = false;
				this.page = false;
				this.displayError();
			}
		);
	}

	fileChecked(e) {
		if (e.check) {
			this.checkedFiles.push(e);
		}else {
			this.checkedFiles.forEach((x, i) => {
				if (x.id == e.id) {
					this.checkedFiles.splice(i, 1); 
				}
			});
		}	
		this.deleteBtn = this.checkedFiles.length > 0 ? true : false;
	}

	closeAllFiles() {
		this.closeAll = !this.closeAll;
	}

	checkEvent() {
		this.checkAll = !this.checkAll;
		if (!this.checkAll) this.deleteBtn = false;
		if (this.checkAll) {
			this.checkedFiles = [];
			this.files.forEach(file => {
				var x = {
					id : file.id,
					check : true
				};
				this.checkedFiles.push(x);
			});
		}else {
			this.checkedFiles = [];
		}
	}

	addNewFile(e) {
		this.form = this.helper.extractFormValues(e);
		if (this.helper.emptyObject(this.form) || isNaN(this.form.year)) {
 			this.popupError = true;
 			return;
 		}
 		this.popupError = false;
 		this.popupLoading = true;
		this.fileService.addFile(this.DashboardService.companyId, this.form).subscribe(
			response => {
				this.popupLoading = false;
				if (!!response.error) {
					this.popupError = true;
				}else {
					this.files.unshift(response);
					this.addNew = false;
				}
			},
			err => {
				this.popupLoading = false;
				this.popupError = true;
			}
		);
	}

	deleteChecked() {
		var ids = [];
		if (!!this.tempId) {
			console.log(this.tempId);
			ids = this.tempId;
		}else {
			this.checkedFiles.forEach(file => {
				ids.push(file.id);
			});
		}
		this.fileService.deleteFiles(ids).subscribe(
			response => {
				if (response !== null) {
					this.displayError();
				}else {
					this.deleteFiles(ids);
				}
			},
			err => {
				this.displayError();
			}
		);
	}

	deleteFiles(ids) {
		this.checkAll = false;
		if (ids.length == this.files.length) {
			this.files = [];
		}else {
			ids.forEach(id => {
				this.files.forEach((file, i) => {
					if (file.id == id) {
						this.files.splice(i, 1); 
					}
				});
			});
		}
	}

	openEditPopup(file) {
		this.editPopupConfig = [];
		this.fileToEdit = file;
		this.addNewConfig.forEach(item => {
			var _item = Object.assign({}, item);
			_item.value = file[item.name];
			if (_item.name !== "type") {
				this.editPopupConfig.push(_item);
			}
		});
		this.editPopup = true;
	}

	editFile(e) {
		this.form = this.extractUpdate(this.helper.extractFormValues(e));
		if (!!this.form.year && isNaN(this.form.year)) {
 			this.popupError = true;
 			return;
 		}
 		if (Object.keys(this.form).length === 0 && this.form.constructor === Object) {
 			this.editPopup = false;
 			return;
 		}
 		this.popupLoading = true;
 		this.fileService.editFile(this.fileToEdit.id, this.form).subscribe(
 			response => {
 				this.popupLoading = false;
				this.editPopup = false;
 				if (response !== null) {
 					this.displayError();
 				}else {
 					this.updateFile();
 				}
 			},
 			err => {
 				this.popupLoading = false;
				this.editPopup = false;
				this.displayError();
 			}
 		);
	}

	updateFile() {
		this.files.forEach(file => {
			if (file.id == this.fileToEdit.id) {
				for (var item in this.form) {
					file[item] = this.form[item];
				}
			}
		});
	}

	extractUpdate(obj) {
		for (var item in obj) {
			if (obj[item] == "") delete obj[item];
			if (obj[item] == this.fileToEdit[item]) delete obj[item];
		}
		return obj;
	}

	displayError() {
		this.alertType = "error";
		this.alertPopup = true;
	}

	alertAnswer(e) {
		this[this.alertType+"Answer"](e);
	}

	errorAnswer(e) {
		this.alertPopup = false;
	}

	deleteAnswer(e) {
		if (e) {
			this.deleteChecked();
			this.alertPopup = false;
		}else {
			this.alertPopup = false;
		}
	}

	deleteAlert(e?) {
		this.tempId = null;
		if (!!e) this.tempId = e;
		this.alertType = "delete";
		this.alertPopup = true;
	}
}
