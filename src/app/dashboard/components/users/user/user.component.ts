import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

	@Output() deleted = new EventEmitter<any>();
	@Output() edit = new EventEmitter<number>();
	@Output() block = new EventEmitter<any>();
	@Input() user:any;
	moreOptions:boolean = false;

	constructor(
		private userService:UsersService,
		private dashboard:DashboardService
	) { }

	toggleOptions() {
		this.moreOptions = !this.moreOptions;
	}

	closeOptions() {
		this.moreOptions = false;
	}

	editUser() {
		this.edit.emit(this.user.user_id);
	}

	deleteUser() {
		var companyId = this.dashboard.companyId;
		this.userService.detele(this.user.user_id, companyId).subscribe(
			response => {
				if (response == null) {
					this.deleted.emit(this.user.user_id);
				}else if(!!response.error) {
					this.deleted.emit(false);
				}
			},
			err => {
				this.deleted.emit(false);
			}
		);	
	}

	blockUser() {
		this.block.emit({val : 'block', userId : this.user.user_id});
	}

	unblockUser() {
		this.block.emit({val : 'unblock', userId : this.user.user_id});
	}
}
