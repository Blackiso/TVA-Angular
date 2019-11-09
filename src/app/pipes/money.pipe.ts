import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

	transform(value: any, ...args: any[]): any {
		var int = new Intl.NumberFormat('arab').format(value).toString().replace(new RegExp(",", "g"), ' ');
		var y = int.split('.');
		if (y[1] == undefined) {
			y[1] = "00";
		}else {
			var x = y[1].toString();
			if (x.length < 2) {
				y[1] = x+"0";
			}
		}
		return y.join('.');
	}

}
