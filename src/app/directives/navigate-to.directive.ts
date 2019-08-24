import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[navigateTo]'
})
export class NavigateToDirective {

	@Input() navigateTo:any;
	private mainElem:any;

	constructor(
		private router:Router,
		private el: ElementRef
	) {
		this.mainElem = el.nativeElement;
	}

	@HostListener('click')
	navigate() {
		let parent = this.mainElem.parentNode;
		this.router.navigate(this.navigateTo.path);	
		
		[...parent.children].forEach(child => {
			child.classList.remove(this.navigateTo.class);
		});
		this.mainElem.classList.add(this.navigateTo.class);
	}

}
