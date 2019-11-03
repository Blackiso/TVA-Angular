import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[blockClick]'
})
export class BlockClickDirective {

	@Input() blockClick:any;
	private mainElem:any;

	constructor(
		private el: ElementRef
	) {
		this.mainElem = el.nativeElement;
	}

	@HostListener('click', ['$event'])
	block(e) {
		e.preventDefault();
		console.log(e);
	}
}
