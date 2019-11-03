import { Component, OnInit, HostListener } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { DashboardService } from '../../services/dashboard.service';
import { HelperModule } from '../../../modules/helper.module';
import { LocalStorageService } from '../../../services/local-storage.service';

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
	companyId:any;
	addNew:boolean = false;
	addNewConfig:any = [
		{
			name : 'file_name',
			placeholder : 'Nom de dossier',
			title : 'Nom'
		},
		{
			name : 'type',
			placeholder : 'Type de dossier',
			title : 'Type',
			type : 'select',
			options : [
				{
					name : 'Trimestriel',
					value : 'quarterly'
				},
				{
					name : 'Mensuel',
					value : 'monthly'
				}
			]
		},
		{
			name : 'year',
			placeholder : 'Année de création',
			title : 'Année'
		}
	];
	popupError:boolean = false;
	popupTiltle:string = "Créer un nouveau dossier";
	popupLoading:boolean = false;
	form:any;
	scrollCallBack:any;
	loading:boolean = false;
	morePages:boolean = true;
	page:boolean = false;
	editPopupConfig:any;
	editPopup:boolean = false;
	editPopupTiltle:string = "Modifier le dossier";
	fileToEdit:any;
	alertPopup:boolean = false;
	alertType:string = "error";
	currentFilesAll:boolean = true;
	checkedFiles:any = [];
	errorInput:any = [];

	constructor(
		private helper:HelperModule,
		private fileService:FilesService,
		private DashboardService:DashboardService,
		private local:LocalStorageService
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

	checkAllFiles(e) {
		if (e.currentTarget.checked) {
			this.checkedFiles = [];
			this.files.forEach(file => {
				this.checkedFiles.push(file.id);
			});
		}else {
			this.checkedFiles = [];
		}
	}

	checkSingleFile(e) {
		if (e.val) {
			this.checkedFiles.push(e.id);
		}else {
			this.checkedFiles.forEach((id, i) => {
				if (id == e.id) {
					this.checkedFiles.splice(i, 1);
				}
			});
		}
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
					if (response.error.exit) this.morePages = false;
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
				this.morePages = false;
				this.displayError();
			}
		);
	}

	closeAllFiles() {
		this.closeAll = !this.closeAll;
	}

	addNewFile(e) {
		this.errorInput = [];
		this.form = e;
		if (isNaN(this.form.year)) {
 			this.errorInput.push('year');
 			this.errorInput = this.errorInput.slice();
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
		this.fileService.deleteFiles(this.checkedFiles).subscribe(
			response => {
				if (response !== null) {
					this.displayError();
				}else {
					this.deleteFiles(this.checkedFiles);
				}
			},
			err => {
				this.displayError();
			}
		);
	}

	deleteFiles(ids) {
		var companyId = this.local.getItem('companyId');
		var _files = JSON.parse(this.local.getItem('files'));
		var compIndex;
		_files.forEach((obj, i) => {
			if (obj.id == companyId) {
				compIndex = i;
			}
		});
		if (ids.length == this.files.length) {
			this.files = [];
			_files[compIndex].files = [];
		}else {
			ids.forEach(id => {
				this.files.forEach((file, i) => {
					if (file.id == id) {
						this.files.splice(i, 1); 
					}
				});
				_files[compIndex].files.forEach((file, i) => {
					if (file.id == id) {
						_files[compIndex].files.splice(i, 1);
					}
				});
			});
		}
		this.local.addItem('files', JSON.stringify(_files));
		this.checkedFiles = [];
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
		this.form = this.extractUpdate(e);
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
		if (!!e) {
			this.checkedFiles = [];
			this.checkedFiles.push(e);
		}
		this.alertType = "delete";
		this.alertPopup = true;
	}
}
