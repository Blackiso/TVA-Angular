import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { CompaniesService } from '../../../../services/companies.service';
import { LocalStorageService } from '../../../../services/local-storage.service';

@Component({
  selector: 'app-overview-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['../overview.component.css']
})
export class StatsComponent implements OnInit {

	public barChartOptions: ChartOptions = {
		responsive: true,
		scales: { xAxes: [{}], yAxes: [{ ticks: {beginAtZero: true} }] },
		plugins: {
			datalabels: {
				anchor: 'end',
				align: 'end',
			}
		}
	};
	public barChartLabels: Label[] = [];
	public barChartType: ChartType = 'bar';
	public barChartLegend = false;
	public barChartPlugins = [pluginDataLabels];
	public barChartData: ChartDataSets[] = [
		{ 
			data: [],
			backgroundColor: 'rgba(59, 166, 222, 0.54)',
			hoverBackgroundColor: 'rgba(59, 166, 222, 0.54)',
			borderColor: 'rgba(59, 166, 222, 0.8)',
			pointBackgroundColor: '#4896ef',
      		pointBorderColor: '#4896ef',
		}
	];
	public lineChartType = 'line';
	public names:any = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
	public companyId:any;


	constructor(private compService:CompaniesService, private local:LocalStorageService) {
		this.companyId = this.local.getItem('companyId');
		this.compService.getStats(this.companyId).subscribe(
			response => {
				if (!!response.error) {
					
				}else {
					this.setData(response);
				}
			}
		);
	}

	ngOnInit() {
	}

	setData(data) {
		data.forEach(x => {
			this.barChartData[0].data.push(x.total_tva);
			this.barChartLabels.push(this.names[x.month-1]);
		});
	}

}
