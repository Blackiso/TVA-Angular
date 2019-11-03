import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BillsService } from '../../dashboard/services/bills.service';

@Component({
  selector: 'app-tva-table',
  templateUrl: './tva-table.component.html',
  styleUrls: []
})
export class TvaTableComponent implements OnInit {

	@Output() close = new EventEmitter<any>();
	@Output() error = new EventEmitter<any>();
	@Input() fileId:any;
	@Input() month:any;
	titles:any = {
		'20' : "TVA récuperer 20%",
		'14' : "TVA récuperer 14%",
		'10' : "TVA récuperer 10%",
		'7' : "TVA récuperer 7%",
		'transport' : "TVA récupérable sur tranport",
		'bank' : "TVA récupérable sur services bancaires"
	};
	data:any;
	totalTVA:number = 0;

	constructor(private billsService:BillsService) { }

	ngOnInit() {
		this.billsService.getTable(this.fileId, this.month).subscribe(
			response => {
				if (!!response.error) {
					this.error.emit(true);				
				}else {
					this.data = response;
					this.calculateTotal();
				}
			},
			err => {
				this.error.emit(true);
			}
		);
	}

	calculateTotal() {
		var total = 0;
		for (let key in this.data) {
			total += this.data[key];
		}
		this.totalTVA = total;
	}

	closeMe() {
		this.close.emit(true);
	}

}