import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
	selector: '[clickAway]'
})
export class ClickAwayDirective {

	constructor() { }

	@Output('clickAway')
	clickEvent:any = new EventEmitter();

	@HostListener('document:click', ['$event.target'])
	clicked(target) {
		while(target.parentNode) {
			if (target.classList.contains('trigger-btn')) {
				return;
			}
			target = target.parentNode;
		}
		this.clickEvent.emit(null);
	}
}
