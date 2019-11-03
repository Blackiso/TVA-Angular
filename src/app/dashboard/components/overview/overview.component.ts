import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

	constructor(private DashboardService:DashboardService) { }

	ngOnInit() {
		this.DashboardService.setCurruntComponent('overview');
	}

}
