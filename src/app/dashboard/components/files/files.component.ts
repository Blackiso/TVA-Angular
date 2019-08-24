import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { Subject } from 'rxjs';

import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

	public files_number:number = 5;
	public checkAll:boolean = false;

	constructor(
		private fileService:FilesService,
		private DashboardService:DashboardService
	) { }

	ngOnInit() {
		
	}

	public checkEvent(e) {
		let current = e.target;
		this.checkAll =  current.checked;
		this.fileService.checkAllF(current.checked);
	}

	public addNew() {
		console.log("add New File");
	}
}
