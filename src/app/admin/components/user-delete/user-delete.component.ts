import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { User } from '@models';
import { UsersService } from '../../services';
import {
  CurrentUserService
} from '@core-services';

@Component({
  selector: 'app-role-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})

export class UserDeleteComponent implements OnInit {
  public user: User;
  public isHimself: boolean;
  public errors: string[] = null;
  public onUserDelete: EventEmitter<User> = new EventEmitter();

  constructor(
    public bsModalRef: BsModalRef,
    public currentUser: CurrentUserService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.isHimself = this.user.id === this.currentUser.id;
  }

  public showNameOrEmail(): string {
    let str: string;
    if (this.user.invitationToken) {
      str = this.user.email;
    } else {
      str = `${this.user.name} ${this.user.surname}`;
    }
    return str;
  }

  public delete(): void {
    this.usersService
      .removeUser(this.user)
      .subscribe(
        () => {
          this.onUserDelete.emit(this.user);
        }
      );
  }
}
