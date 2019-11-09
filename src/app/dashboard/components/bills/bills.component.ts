import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BillsService } from '../../services/bills.service';
import { DashboardService } from '../../services/dashboard.service';
import { HelperModule } from '../../../modules/helper.module';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {

	allBills:boolean = true;
	addLoading:boolean = false;
	loading:boolean = true;
	bills:any = [];
	addPopup:boolean = false;
	fileId:number;
	month:number;
	scrollCallBack:any;
	morePages:boolean = true;
	page:boolean = true;
	alertPopup:boolean = false;
	alertType:string;
	names:any = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
	checkedBills:any = [];
	closeAll_:any = false;
	tvaTable:boolean = false;

	constructor(
		private activeRoute: ActivatedRoute, 
		private billsService:BillsService,
		private helper:HelperModule,
		private DashboardService:DashboardService
	) {
		this.scrollCallBack = this.loadPages.bind(this);
		this.activeRoute.params.subscribe(params => {
            this.fileId = params['file'];
            this.month = params['month'];
        });
	}

	ngOnInit() {
		this.DashboardService.setCurruntComponent('bills');
		this.getAllBills();
		this.DashboardService.searchValue.subscribe(
			keyword => {
				if (keyword == "") {
					if (!this.allBills) {
						this.getAllBills();
					}
				}else {
					this.allBills = false;
					this.searchBills(keyword);
				}
			}
		);
	}

	closeAll() {
		this.closeAll_ = !this.closeAll_; 
	}

	searchBills(keyword) {
		if (!this.loading) {
			this.loading = true;
			this.billsService.searchFor(keyword, this.fileId, this.month).subscribe(
				response => {
					this.loading = false;
					if (!!response.error) {
						this.displayError();
					}else {
						this.bills = response;
					}
				},
				err => {
					this.displayError();
				}
			);
		}
	}

	checkAllBills(e) {
		if (e.currentTarget.checked) {
			this.checkedBills = [];
			this.bills.forEach(bill => {
				this.checkedBills.push(bill.id);
			});
		}else {
			this.checkedBills = [];
		}
	}

	checkSingleBill(e) {
		if (e.val) {
			this.checkedBills.push(e.id);
		}else {
			this.checkedBills.forEach((id, i) => {
				if (id == e.id) {
					this.checkedBills.splice(i, 1);
				}
			});
		}
	}

	openPDF() {
		window.open(location.origin+"/api/download/"+this.fileId+"/"+this.month+"/pdf");
	}

	openXML() {
		// window.open(location.origin+"/api/download/"+this.fileId+"/"+this.month+"/xml");
		this.displayDownload();
	}

	downloadXML(name) {
		if (name == "" || name == true) {
			name = this.fileId+"-"+this.month;
		}
		this.billsService.getXML(this.fileId, this.month).subscribe(
			response => {
				var a = document.createElement('a');
		        var blob = new Blob([response], {type: "text/plain;charset=utf-8"});
            	var url = window.URL.createObjectURL(blob);
		        a.href = url;
		        a.download = name+'.xml';
		        document.body.append(a);
		        a.click();
		        a.remove();
		        window.URL.revokeObjectURL(url);
			}
		);
	}

	addNewBill(data) {
		console.log(data);
		var billsData = {
			month : this.month,
			bills : []
		};
		billsData.bills.push(data);
		this.addLoading = true;
		this.billsService.addBill(billsData, this.fileId).subscribe(
			response => {
				this.addLoading = false;
				if (!!response.error) {
					this.addPopup = false;
					this.displayError();
				}else {
					response.forEach(bill => {
						this.bills.unshift(bill);
					});
				}
			},
			err => {
				this.addPopup = false;
				this.displayError();
			}
		);
	}

	loadPages() {
		if (!this.loading && this.morePages) {
			this.page = true;
			var lastItem = this.bills.slice(-1)[0].id;
			this.getAllBills(lastItem);
		}
	}

	getAllBills(lastItem?) {
		this.allBills = true;
		var lastItem = !!lastItem ? lastItem : false;
		this.loading = true;
		this.billsService.getAll(this.fileId, this.month, lastItem).subscribe(
			response => {
				this.loading = false;
				if (!!response.error) {
					this.page = false;
					if (response.error.exit) this.morePages = false;
					this.displayError();
				}else {
					this.bills = !this.page ? response : this.bills.concat(response);
					this.page = false;
					if (response.length < 20) this.morePages = false;
				}
			},
			err => {
				this.page = false;
				this.morePages = false;
				this.displayError();
			}
		);
	}

	deleteAnswer(e) {
		if (e) {
			this.billsService.deleteBills(this.checkedBills).subscribe(
				response => {
					this.alertPopup = false;
					if (response !== null) {
						this.displayError();
					}else {
						this.removeBill();
					}
				},
				err => {
					this.displayError();
					this.alertPopup = false;
				}
			);
		}else {
			this.alertPopup = false;
		}
	}

	removeBill() {
		if (this.bills.length == this.checkedBills.length) {
			this.bills = [];
		}else {
			this.checkedBills.forEach(id => {
				this.bills.forEach((bill, i) => {
					if (bill.id == id) {
						this.bills.splice(i, 1); 
					}
				});
			});
		}
		this.checkedBills = [];
	}

	deleteAlert(e?) {
		if (e) {
			this.checkedBills = [];
			this.checkedBills.push(e);
		}
		if (this.checkedBills.length == 0) return;
		this.alertType = "delete";
		this.alertPopup = true;
	}

	alertAnswer(e) {
		this[this.alertType+"Answer"](e);
	}

	errorAnswer(e) {
		this.alertPopup = false;
	}

	xmlAnswer(e) {
		this.alertPopup = false;
		if (e !== false) {
			this.downloadXML(e);
		}
	}

	displayError() {
		this.loading = false;
		this.addLoading = false;
		this.tvaTable = false;
		this.alertType = "error";
		this.alertPopup = true;
	}

	displayDownload() {
		this.alertType = "xml";
		this.alertPopup = true;
	}
}
