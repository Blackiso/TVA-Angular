import { Component, Output, EventEmitter } from '@angular/core';
import { UsersService } from '../../dashboard/services/users.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: []
})
export class AddUserComponent {

	@Output() addNew = new EventEmitter<boolean>(); 
	@Output() addUser = new EventEmitter<any>(); 
	@Output() user = new EventEmitter<any>();
	@Output() close = new EventEmitter<boolean>();
	users:any = [];
	shownType:string = "hover";
	searchUser:boolean = false;

	constructor(private usersService:UsersService) { }

	search(e, x) {
		var value = e.currentTarget.value;
		if (value.length == 0) this.users = [];
		if (!x && value.length < 3) return;

		this.usersService.searchUsers(value).subscribe(
			response => {
				this.users = response;
			}
		)
	}

	add(user) {
		this.addUser.emit(user);
	}

	_close() {
		this.close.emit(true);
	}

	_addNew() {
		this.addNew.emit(true);
	}

}
