import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { HelperModule } from '../../../modules/helper.module';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	@Input() component:boolean = false;
	@Output() close = new EventEmitter<boolean>();
	error:boolean = false;
	alertType:string = 'error';
	passwordAlert:boolean = false;
	password:string;

	constructor(
		private helper:HelperModule,
		private DashboardService:DashboardService
	) { }

	ngOnInit() {
		this.DashboardService.setCurruntComponent('settings');
	}

	getPassword() {
		this.passwordAlert = true;
	}

	passwordAccuired(e) {
		if (e !== false) {
			this.password = e;
		}
		this.passwordAlert = false;
	}

	showError() {
		this.error = true;
	}

	hideError() {
		this.error = false;
	}

	closeMe() {
		this.close.emit(true);
	}

}
