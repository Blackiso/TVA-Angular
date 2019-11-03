import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HelperModule } from '../../modules/helper.module';
import { UserDataService } from '../../services/user-data.service';
import { CompaniesService } from '../../services/companies.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { AuthenticationService } from '../../services/authentication.service';
import { NgScrollbar } from 'ngx-scrollbar';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

	@ViewChild(NgScrollbar, {static: false}) scrollbarRef: NgScrollbar;

	userName:string;
	userType:string;
	userEmail:string;
	form:any;
	companies:any = [];
	loading:boolean = true;
	errorInput:any = [];
	popupError:boolean = false;
	popupLoading:boolean = false;
	addNewPopup:boolean = false;
	alertPopup:boolean = false;
	alertType:string;
	toBeDeleted:string;
	shownType:string = "hover";
	popupTiltle:string = "Création d'une nouvelle société";
	stopPages:boolean = false;
	searchKeyword:string;
	searching:boolean;
	contactPopup:boolean = false;
	settingPopup:boolean = false;
	dropMenu:boolean = false;
	addPopupConfig:any = [
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
			placeholder : 'Email de société',
			title : 'Email',
			optional : true
		}
	];

	constructor(
		private helper:HelperModule,
		private userData:UserDataService,
		private compService:CompaniesService,
		private local:LocalStorageService,
		private authSearvice:AuthenticationService,
		private titleService: Title
	) {
		this.userName = this.userData.userName;
		this.userType = this.userData.userType;
		this.userEmail = this.userData.userEmail;
		this.titleService.setTitle("Paramanagers | Sociétés");
	}

	ngOnInit() {
		this.getAll();
	}

	ngAfterViewInit() {
		this.scrollbarRef.scrolled.pipe(
			map(
				(e) => {
					if (!this.loading && !this.stopPages) {
						if (e.target.scrollTop >= e.target.clientHeight) {
							this.loading = true;
							var lastItemId = this.companies.slice(-1)[0].id;
							this.getAll(lastItemId);
						}
					}
				}
			)
		).subscribe();
	}

	deleteAlert(e) {
		this.toBeDeleted = e.currentTarget.id;
		this.alertType = "delete";
		this.alertPopup = true;
	}

	alertAnwser(anwser) {
		this[this.alertType](anwser);
	}

	dashboard(e) {
		var companyId = e.currentTarget.id;
		var _company = this.getCompany(companyId);
		this.local.addItem('companyId', companyId);
		this.local.addItem('companyName', _company.company_name);

		var found = false;
		var emptyObj = {
			id : companyId,
			files : []
		};
		var localFiles = JSON.parse(this.local.getItem('files'));
		if (localFiles == null) {
			localFiles = [];
			localFiles.push(emptyObj);
		}else {
			localFiles.forEach(x => {
				if (x.id == companyId) {
					found = true;
				}
			});
			if (!found) {
				localFiles.push(emptyObj);
			}
		}

		this.local.addItem('files', JSON.stringify(localFiles));
		this.helper.reRoute(['/dashboard']);
	}

	delete(x) {
		if (x) {
			this.compService.delete(this.toBeDeleted).subscribe(
				response => {
					this.deleteFromArray(this.toBeDeleted);
					this.clearPopup();
				},
				err => {
					this.clearPopup();
					setTimeout(()=> {
						this.showError();
					}, 200);
				}
			)
		}else {
			this.clearPopup();
		}
 	}

 	search(e) {
 		if (e.target.value.length > 2) {
 			this.searchKeyword = e.target.value;
 			this.searching = true;
 			this.loading = true;
 			this.searchCompany();
 		}else if (e.target.value.length == "" && this.searching) {
 			this.getAll();
 		}
 	}

 	searchCompany() {
 		this.compService.search(this.searchKeyword).subscribe(
 			response => {
 				this.companies = response;
				this.stopPages = response.length < 20 ? true : false;
				this.loading = false;
 			},
 			err => {
 				this.loading = false;
				setTimeout(()=> {
					this.showError();
				}, 200);
 			}
 		);
 	}

 	clearPopup() {
 		this.toBeDeleted = "";
		this.alertType = "";
		this.alertPopup = false;
 	}

 	showError() {
 		this.alertType = "error";
 		this.alertPopup = true;
 	}

 	error() {
 		this.clearPopup();
 	}

 	addNew(e) {
 		this.errorInput = [];
 		this.form = e;
 		if (isNaN(this.form.i_f) || this.form.i_f.length > 8) {
 			this.addErrorInput('i_f');
 			return;
 		}

 		if (isNaN(this.form.phone) || this.form.phone.length > 10 || this.form.phone.length < 10) {
 			this.addErrorInput('phone');
 			return;
 		}

 		if (this.form.email == "") {
 			this.form.email = this.userData.userEmail;
 		}

 		this.popupLoading = true;
 		this.compService.addCompany(this.form).subscribe(
 			response => {
 				this.popupLoading = false;
 				if (response.error) {
 					this.popupError = true;
 				}else {
 					this.popupError = false;
 					this.addFromArray(response);
 					this.togglePopup();
 				}
 			},
 			err => {
 				this.popupError = true;
 				this.popupLoading = false;
 			}
 		)
 	}

 	addErrorInput(name) {
 		this.errorInput.push(name);
 		this.errorInput = this.errorInput.slice();
 	}

 	togglePopup() {
 		this.popupError = false;
 		this.addNewPopup = !this.addNewPopup;
 	}

 	addFromArray(obj) {
 		this.companies.unshift(obj);
 	}

 	deleteFromArray(id) {
 		this.companies.forEach((comapny, index) => {
 			if (comapny.id == id) {
 				this.companies.splice(index, 1); 
 			}
 		});
 	}

 	getCompany(id) {
 		for (var i = 0; i < this.companies.length; i++) {
 			if (this.companies[i].id == id) {
 				return this.companies[i];
 			}
 		}
 	}

 	getAll(lastItem?) {
 		this.stopPages = false;
 		lastItem = !!lastItem ? lastItem : false;
 		this.compService.getAll(lastItem).subscribe(
			response => {
				if (response.error) {
					setTimeout(()=> {
						this.showError();
					}, 200);
				}else {
					if (this.searching) {
						this.companies = response;
						this.searching = false;
					}else {
						this.companies = this.companies.concat(response);
					}
					
					if (response.length < 20) {
						this.stopPages = true;
					}
				}
				this.loading = false;
			},
			err => {
				this.loading = false;
				setTimeout(()=> {
					this.showError();
				}, 200);
			}
		)
 	}

 	logout() {
		this.authSearvice.logout().subscribe(
			response => {
				if (response == null) {
					this.userData.clearUser();
					this.sendClick('user_loggedOut_companies');
					this.helper.reRoute(['/home']);
				}
			}
		);
	}

	hoverBtn(e) {
		var btn = e.target;
		btn.classList.add('hovered');
	}

	outBtn(e) {
		var btn = e.target;
		btn.classList.remove('hovered');
	}

	sendClick(name) {
		this.helper.analyticsEvent(name);
	}

}
