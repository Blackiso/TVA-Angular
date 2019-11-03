import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DashboardService } from '../services/dashboard.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { HelperModule } from '../../modules/helper.module';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

	company:string;
	currentComponent:string;

	constructor(
		private activeRoute:ActivatedRoute,
		private DashboardService:DashboardService,
		private localStorage:LocalStorageService,
		private helper:HelperModule,
		private titleService: Title
	) {
		this.DashboardService.companyId = this.localStorage.getItem('companyId');
		if (this.localStorage.getItem('companyId') == null) {
			this.helper.reRoute(['companies']);
		}
		this.company = this.DashboardService.companyName = this.localStorage.getItem('companyName');
		this.titleService.setTitle("Paramanagers | Tableau de bord");
	}

	ngOnInit() {
		this.DashboardService.currentComponentS.subscribe(
			component => {
				this.currentComponent = component;
			}
		);
	}

}
