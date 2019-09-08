import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[scrollLoading]'
})
export class ScrollLoadingDirective {

	@Input() scrollLoading:any;

	constructor(private el: ElementRef) {}

	@HostListener('document:scroll', ['$event.target']) 
	onMouseEnter(target) {
		var st = target.documentElement.scrollTop;
		var ch = target.documentElement.clientHeight;
		var sh = target.documentElement.scrollHeight;
		if ((st + ch) / sh == 1) {
			this.scrollLoading();
		}
	}

}
