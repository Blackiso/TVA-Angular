import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../../../../services/companies.service';
import { DashboardService } from '../../../services/dashboard.service';
import { HelperModule } from '../../../../modules/helper.module';
import { UserDataService } from '../../../../services/user-data.service';

@Component({
  selector: 'app-overview-details',
  templateUrl: './details.component.html',
  styleUrls: ['../overview.component.css']
})
export class DetailsComponent implements OnInit {

	loaded:boolean = false;
	data:any;
	companyId:any;
	editPopup:boolean = false;
	popupLoading:boolean = false;
	popupError:boolean = false;
	editPopupTiltle:string = "Modifier la société";
	editPopupConfig:any = [
		{
			name : 'company_name',
			placeholder : 'Le nom de votre société',
			title : 'Le nom'
		},
		{
			name : 'activity',
			placeholder : "L'activité de votre société",
			title : "L'activité"
		},
		{
			name : 'i_f',
			placeholder : 'Identifiant fiscal e.g 12345678',
			title : 'Identifiant fiscal (IF)'
		},
		{
			name : 'address',
			placeholder : 'Adresse de la société',
			title : 'Adresse'
		},
		{
			name : 'phone',
			placeholder : 'Numéro de téléphone  e.g 06XXXXXXXX',
			title : 'téléphone'
		},
		{
			name : 'email',
			placeholder : 'Email de société (optionnel)',
			title : 'Email',
			optional : true
		}
	];
	form:any;
	errorInput:any = [];

	constructor(
		private companies:CompaniesService, 
		private dashboard:DashboardService, 
		private helper:HelperModule,
		private userData:UserDataService
	) {
		this.companyId = this.dashboard.companyId;
	}

	ngOnInit() {
		this.companies.getCompany(this.companyId).subscribe(
			response => {
				if (!!response.error) {
					// code...
				}else {
					this.loaded = true;
					this.data = response;
				}
			}
		);
	}

	lunchPopup() {
		this.editPopupConfig.forEach(inp => {
			inp.value = this.data[inp.name];
		});
		this.editPopup = true;
	}

	addErrorInput(name) {
 		this.errorInput.push(name);
 		this.errorInput = this.errorInput.slice();
 	}

	editCompany(e) {
		this.form = this.extractUpdate(e);
		if (Object.keys(this.form).length === 0 && this.form.constructor === Object) {
 			this.editPopup = false;
 			return;
 		}

 		if (!!this.form.i_f) {
	 		if (isNaN(this.form.i_f) || this.form.i_f.length > 8) {
	 			this.addErrorInput('i_f');
	 			return;
	 		}
	 	}

	 	if (!!this.form.phone) {
	 		if (isNaN(this.form.phone) || this.form.phone.length > 10 || this.form.phone.length < 10) {
	 			this.addErrorInput('phone');
	 			return;
	 		}
	 	}

	 	if (!!this.form.email) {
	 		if (this.form.email == "") {
	 			this.form.email = this.userData.userEmail;
	 		}
	 	}
	 	this.popupLoading = true;
		this.companies.updateCompany(this.companyId, this.form).subscribe(
			response => {
				this.popupLoading = false;
				if (response !== null) {
					this.popupError = true;
				}else {
					this.popupError = false;
					this.editPopup = false;
					this.addUpdates()
				}
			},
			err => {
				this.popupLoading = false;
				this.popupError = true;
			}
		);
	}

	addUpdates() {
		for (var key in this.form) {
			this.data[key] = this.form[key];
			if (key == 'company_name') {
				this.dashboard.setName(this.form[key]);
			}
		}
	}

	extractUpdate(obj) {
		for (var item in obj) {
			if (obj[item] == "") delete obj[item];
			if (obj[item] == this.data[item]) delete obj[item];
		}
		return obj;
	}

}
