import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HelperModule } from '../../../modules/helper.module';
import { DashboardService } from '../../services/dashboard.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

	companyId:string;
	users:any = [];
	addNewPopup:boolean = false;
	adduserPopup:boolean = false;
	popupError:boolean = false;
	popupTiltle:string = "Ajouter un nouveau utilisateur";
	typePopup:string = "new";
	addPopupConfig:any = [
		{
			name : 'name',
			placeholder : "Nouveau nom d'utilisateur",
			title : 'Nom'
		},
		{
			name : 'email',
			placeholder : "Nouvel email d'utilisateur",
			title : 'Email',
			type : 'user_email'
		},
		{
			name : 'password',
			placeholder : "Nouveau mot de passe d'utilisateur",
			title : 'Mot de passe',
			type : 'password'
		},
		{
			name : 'wild',
			placeholder : '',
			title : 'Ajouter à toutes les autres sociétés',
			type : 'checkBox',
			hideTitle : true
		}
	];
	form:any;
	loading:boolean;
	loadingUsers:boolean = false;
	alertPopup:boolean = false;
	alertType:string = "error";
	editPopup:boolean = false;
	editConfig:any = [];
	editPopupTiltle:string = "Modifier l'utilisateur";
	userToEdit:number;
	errorInput:any = [];

	constructor(
		private helper:HelperModule,
		private usersService:UsersService,
		private dashboard:DashboardService
	) { }

	ngOnInit() {
		this.dashboard.setCurruntComponent('users');
		this.companyId = this.dashboard.companyId;
		this.getAll();
	}

	getAll() {
		this.loadingUsers = true;
		this.usersService.getAll(this.companyId).subscribe(
			response => {
				this.loadingUsers = false;
				if (!!response.error) {
					this.displayError();
				}else {
					response.forEach(user => {
						user.password = "@@@@@@@@@@@@@";
					});
					this.users = response;
				}
			},
			err => {
				this.loadingUsers = false;
				this.displayError();
			}
		)
	}

	editUser(id) {
		this.userToEdit = id;
 		this.displayEditPopup(this.getUserById(id));
	}

	displayEditPopup(user) { 
		this.editConfig = [];
		this.addPopupConfig.forEach(item => {
			var _item = Object.assign({}, item);;
			if (item.name == "email") {
				_item.value = user[item.name].split('@')[0];
			}else if (item.name == "password") {
				_item.title = "Nouveau mot de passe";
				_item.value = user[item.name];
			}else {
				_item.value = user[item.name];
			}
			this.editConfig.push(_item);
		});
		this.editPopup = true;
	}

	editUserSubmit(e) {
		this.form = e;
		this.setupEmail();
		this.form = this.extractUpdate(this.form);
		if (!Object.keys(this.form).length) return;
		if (!!this.form.wild) {
			this.form.wild = this.form.wild == "on" ? 1 : 0;
		}
		this.loading = true;
		this.usersService.updateUser(this.form, this.userToEdit).subscribe(
			response => {
				this.loading = false;
				this.editPopup = false;
				if (response !== null) {
					this.displayError();
				}else {
					this.updateUserFinish();
				}
			},
			err => {
				this.loading = false;
				this.editPopup = false;
				this.displayError();
			}
		);
	}

	updateUserFinish() {
		this.users.forEach((user, i) => {
			if (user.user_id == this.userToEdit) {
				for (var userItem in this.users[i]) {
					if (!!this.form[userItem]) {
						this.users[i][userItem] = this.form[userItem];
					}
				}
			}
		});
	}

	extractUpdate(obj) {
		var user = this.getUserById(this.userToEdit); 
		for (var item in obj) {
			if (obj[item] == "") delete obj[item];
			if (obj[item] == user[item]) delete obj[item];
		}
		return obj;
	}

	getUserById(id) {
		var _user;
		this.users.forEach((user, index) => {
 			if (user.user_id == id) {
 				_user = user;
 			}
 		});
 		return _user;
	}

	deleteUser(id) {
		if (!id) {
			this.displayError();
		}else {
			this.users.forEach((user, index) => {
	 			if (user.user_id == id) {
	 				this.users.splice(index, 1); 
	 			}
	 		});
		}
	}

	togglePopup() {
		this.popupError = false;
		this.adduserPopup = !this.adduserPopup;
	}

	addUser(user) {
		this.adduserPopup = false;
		this.usersService.addUserToCompany(user.user_id, this.dashboard.companyId).subscribe(
			response => {
				if (response !== null) {
					this.displayError();
				}else {
					this.users.unshift(user);
				}
			},
			err => {
				this.displayError();
			}
		);
	}

	addNew() {
		this.adduserPopup = false;
		this.addNewPopup = true;
	}

	addNewUser(e) {
		this.errorInput = [];
		this.form = e;
		if (!this.setupEmail()) {
			this.errorInput.push('email');
			this.errorInput = this.errorInput.slice();
			return;
		}
		this.form.wild = this.form.wild == "on" ? 1 : 0;
 		this.loading = true;
 		this.form.company = this.dashboard.companyId;
 		this.usersService.addNewUser(this.form).subscribe(
 			response => {
 				this.loading = false;
 				if (!!response.error) {
 					this.popupError = true;
 				}else {
 					this.users.unshift(response);
 					this.addNewPopup = false;
 				}	
 			},
 			err => {
 				this.loading = false;
 				this.popupError = true;
 			}
 		)
	}

	setupEmail() {
		if (!this.form.email.includes('@')) {
			this.form.email = this.form.email + "@tva.edg";
			return true;
		}
		return false;
	}

	displayError() {
		this.alertPopup = true;
	}

	hideError() {
		this.alertPopup = false;
	}

	block(event) {
		this.usersService.blockUser(event.val, event.userId).subscribe(
			response => {
				if (response !== null) {
					this.displayError();
				}else {
					this.users.forEach(user => {
						if (user.user_id == event.userId) {
							user.blocked = event.val == 'block' ? 1 : 0;
						}
					});
				}
			},
			err => {
				this.displayError();
			}
		)
	}
}
