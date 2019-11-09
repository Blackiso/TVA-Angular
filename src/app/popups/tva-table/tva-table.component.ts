import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BillsService } from '../../dashboard/services/bills.service';
import { TauxValuesService } from '../../services/taux-values.service';

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
	loading:boolean = true;
	data:any = [];
	totalTVA:number = 0;

	constructor(private billsService:BillsService, private tauxService:TauxValuesService) {}

	ngOnInit() {
		this.billsService.getTable(this.fileId, this.month).subscribe(
			response => {
				if (!!response.error) {
					this.error.emit(true);				
				}else {
					this.data = response;
					this.calculateTotal();
					this.loading = false;
				}
			},
			err => {
				this.error.emit(true);
			}
		);
	}

	getTauxName(code, taux) {
		console.log(code, taux);
		var out;
		this.tauxService.tauxTypes['T'+taux].forEach(type => {
			if (code == type.value) {
				out = type.name;
			}
		});
		return out;
	}

	calculateTotal() {
		var total = 0;
		this.data.forEach(item => {
			total += item.tva;
		});
		this.totalTVA = total;
	}

	closeMe() {
		this.close.emit(true);
	}

}