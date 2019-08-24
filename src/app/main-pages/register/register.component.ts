import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

	step:number = 1;

	nextStep() {
		this.step += 1;
	}

	stepBack() {
		this.step -= this.step !== 1 ? 1 : 0;
	}

}
