import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HelperModule } from '../../modules/helper.module';
import { UserDataService } from '../../services/user-data.service';
import { CompaniesService } from '../../services/companies.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { NgScrollbar } from 'ngx-scrollbar';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

	@ViewChild(NgScrollbar, {static: false}) scrollbarRef: NgScrollbar;

	userName:string;
	userType:string;
	form:any;
	companies:any = [];
	loading:boolean = true;
	popupError:boolean = false;
	addNewPopup:boolean = false;
	alertPopup:boolean = false;
	alertType:string;
	toBeDeleted:string;
	shownType:string = "hover";
	popupTiltle:string = "Creating new company";
	stopPages:boolean = false;
	searchKeyword:string;
	searching:boolean;
	addPopupConfig:any = [
		{
			name : 'company_name',
			placeholder : 'Your company name',
			title : 'Name'
		},
		{
			name : 'activity',
			placeholder : 'Your company activity',
			title : 'Activity'
		},
		{
			name : 'i_f',
			placeholder : 'Identifiant fiscal e.g 12344',
			title : 'Identifiant fiscal (IF)'
		},
		{
			name : 'address',
			placeholder : 'Company Address',
			title : 'Address'
		},
		{
			name : 'phone',
			placeholder : 'Phone numbre  e.g 06XXXXXXXX',
			title : 'Phone number'
		}
	];

	constructor(
		private helper:HelperModule,
		private userData:UserDataService,
		private compService:CompaniesService,
		private local:LocalStorageService
	) {
		this.userName = this.userData.userName;
		this.userType = this.userData.userType;
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
 		this.form = this.helper.extractFormValues(e);
 		if (this.helper.emptyObject(this.form)) {
 			this.popupError = true;
 			return;
 		}

 		this.compService.addCompany(this.form).subscribe(
 			response => {
 				if (response.error) {
 					this.popupError = true;
 				}else {
 					this.popupError = false;
 					this.addFromArray(this.form);
 					this.togglePopup();
 				}
 			},
 			err => {
 				this.popupError = true;
 			}
 		)
 	}

 	togglePopup() {
 		this.popupError = false;
 		this.addNewPopup = !this.addNewPopup;
 	}

 	addFromArray(obj) {
 		delete obj.address;
 		delete obj.phone;
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

}
