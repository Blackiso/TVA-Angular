import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../services/local-storage.service';

@Component({
  selector: 'app-overview-files',
  templateUrl: './files.component.html',
  styleUrls: ['../overview.component.css']
})
export class OverviewFilesComponent implements OnInit {

	files:any;
	closeAll:boolean = false;

	constructor(private local:LocalStorageService) {
		var files = JSON.parse(this.local.getItem('files'));
		var companyId = this.local.getItem('companyId');
		if (files == null) {
			this.files = [];
		}else {
			files.forEach((file, i) => {
				if (file.id == companyId) {
					this.files = file.files.reverse();
				}
			});
		}
	}

	ngOnInit() {
	}

	closeAllFiles() {
		this.closeAll = !this.closeAll;
	}

}
