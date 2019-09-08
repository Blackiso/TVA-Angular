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

	bills:any = [];
	addPopup:boolean = false;
	fileId:number;
	month:number;

	constructor(
		private activeRoute: ActivatedRoute, 
		private billsService:BillsService,
		private helper:HelperModule,
		private DashboardService:DashboardService
	) {
		this.activeRoute.params.subscribe(params => {
            this.fileId = params['file'];
            this.month = params['month'];
        });
	}

	ngOnInit() {
		this.DashboardService.setCurruntComponent('bills');
		this.getAllBills();
	}

	addNewBill(data) {
		var billsData = {
			month : this.month,
			bills : []
		};
		billsData.bills.push(data);
		this.billsService.addBill(billsData, this.fileId).subscribe(
			response => {
				response.forEach(bill => {
					this.bills.unshift(bill);
				});
			}
		);
	}

	getAllBills() {
		this.billsService.getAll(this.fileId, this.month).subscribe(
			response => {
				this.bills = response;
			}
		);
	}
}
