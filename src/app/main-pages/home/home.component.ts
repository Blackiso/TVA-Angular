import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HelperModule } from '../../modules/helper.module';

@Component({
  selector: 'app-home', 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	@ViewChild('home', {static:false}) home: ElementRef;
	@ViewChild('features', {static:false}) features: ElementRef;
	@ViewChild('about', {static:false}) about: ElementRef;
	@ViewChild('pricing', {static:false}) pricing: ElementRef;

	scrolled:boolean = false; 
	contactPopup:boolean = false;
	video:boolean = false;

	constructor(private ElementRef:ElementRef, private titleService: Title, private helper:HelperModule) {
		this.titleService.setTitle('Paramanagers | Accueil');
	}

	ngOnInit() {
		window.addEventListener('scroll', this.navbarScroll.bind(this));
	}

	navbarScroll() {
		var WindowScrollY = window.scrollY == undefined ? window.pageYOffset :
    						window.scrollY;
		this.scrolled = WindowScrollY > 50 ? true : false;
	}

	scrollTo(element) {
		var elementOffset = this[element].nativeElement.offsetTop;
		window.scrollTo({
			top: elementOffset,
			left: 0,
			behavior: 'smooth'
		});
	}

	sendClick(name) {
		this.helper.analyticsEvent(name);
	}

	ngOnDestroy() {
		window.removeEventListener('scroll', this.navbarScroll);
	}
}
