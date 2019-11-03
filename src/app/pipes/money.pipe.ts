import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

	transform(value: any, ...args: any[]): any {
		return new Intl.NumberFormat('arab').format(value).toString().replace(new RegExp(",", "g"), ' ');
	}

}
