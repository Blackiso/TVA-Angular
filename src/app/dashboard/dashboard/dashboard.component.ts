import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { DashboardService } from '../services/dashboard.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

	constructor(
		private activeRoute:ActivatedRoute,
		private DashboardService:DashboardService,
		private localStorage:LocalStorageService
	) {
		this.DashboardService.companyId = this.localStorage.getItem('companyId');
		this.DashboardService.companyName = this.localStorage.getItem('companyName');
	}

	ngOnInit() {
		
	}

}
