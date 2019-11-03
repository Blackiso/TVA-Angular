import { Component, EventEmitter, Output, Input, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: []
})
export class AlertComponent implements OnInit {

	@Output() answerEvent = new EventEmitter<any>();
	@Input() alertType:any;
	types:any = {
		delete : {
			title : "Supprimer l'élément sélectionné",
			msg : "Êtes-vous sûr de vouloir supprimer les éléments sélectionnés?",
			option : ["NON", "OUI"],
			alert : true
		},
		refund : {
			title : "Remboursement de paiement",
			msg : "êtes-vous sûr de vouloir rembourser ce paiement?",
			option : ["NON", "OUI"],
			alert : true
		},
		RefundDone : {
			title : "Remboursement fait",
			msg : "le remboursement effectué, votre compte sera maintenant fermé, le montant remboursé sera envoyé à votre compte dans quelques jours, sinon contactez-nous.",
			option : ["OK"]
		},
		error : {
			title : "Erreur",
			msg : "Une erreur est survenue, veuillez réessayer!",
			option : ["OK"],
			alert : true
		},
		password : {
			title : "Entrer votre mot de passe",
			msg : "Mot de pass",
			placeholder : "mot de pass",
			option : ["ANNULER", "OK"],
			return : true,
			type : "password"
		},
		email : {
			title : "Entrer votre E-mail",
			msg : "Votre E-mail",
			placeholder : "Email",
			option : ["ANNULER", "OK"],
			return : true,
			type : "email"
		},
		emailSent : {
			title : "Email envoyé",
			msg : "Veuillez vérifier votre boîte de réception pour récupérer votre mot de passe.",
			option : ["OK"],
		}
	};
	options:any = {
		OK : true,
		OUI : true,
		NON : false,
		ANNULER : false
	};
	currentType:any;

	ngOnInit() {
		this.currentType = this.types[this.alertType];
	}

	@HostListener('document:keydown', ['$event'])
	pressedEnter(e) {
		if (this.alertType == 'password') {
			return;
		}else {
			if (e.keyCode === 13) {
				var i = this.currentType.option.length > 1 ? 1 : 0;
	         	this.answerEvent.emit(this.options[this.currentType.option[i]]);   
	        }
		}
	}

	answer(x) {
		if (this.currentType.return) {
			var y = document.getElementById('input') as HTMLInputElement;
			var awnser = this.options[x] ? y.value : false;
			this.answerEvent.emit(awnser);
		}else {
			this.answerEvent.emit(this.options[x]);
		}
	}

	sendReturn(e) {
		var val = e.currentTarget.value;
		if (val !== " " || val !== "") {
			this.answerEvent.emit(val);
		}
	}

}
