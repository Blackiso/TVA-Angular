import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: []
})
export class TopbarComponent implements OnInit {

	allowSearch:boolean = false;
	currentComponent:string;
	allowedComponents:any = ['files', 'bills'];

	constructor(private DashboardService:DashboardService) { }

	ngOnInit() {
		this.DashboardService.currentComponentS.subscribe(
			component => {
				this.currentComponent = component;
				this.checkSearch();
			}
		);
	}

	checkSearch() {
		if (this.allowedComponents.includes(this.currentComponent)) {
			this.allowSearch = true;
		}else {
			this.allowSearch = false;
		}
	}

	searchKeyUp(e) {
		if (e.currentTarget.value == "") {
			this.DashboardService.setSearchValue("");
		}
	}

	search(e) {
		this.DashboardService.setSearchValue(e.currentTarget.value);
	}

}
