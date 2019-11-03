import { Directive, Input, ElementRef, HostListener } from '@angular/core';


@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {

	@Input() tooltip:string;
	private mainElem:any;
	private myTooltip:any;

	constructor(
		private el: ElementRef
	) {
		this.mainElem = el.nativeElement;
	}

	@HostListener('mouseover')
	showme() {
		this.myTooltip = Math.floor(Math.random() * 50000);
		var div = document.createElement('DIV');
		div.id = this.myTooltip;
		div.className = "tooltip";
		div.innerHTML = this.tooltip;
		var position = this.mainElem.style.position;
		if (position !== "relative" || position !== "fixed" || position !== "absolute") {
			this.mainElem.style.position = "relative";
		}
		this.mainElem.appendChild(div);
	}

	@HostListener('mouseout')
	hideme() {
		var elem = document.getElementById(this.myTooltip).remove();
	}
}
