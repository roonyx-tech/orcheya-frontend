import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UsersService } from '../../services';
import { User, Role } from '@models';
import {
  UserEditComponent,
  UserDeleteComponent,
  InvitedDeleteComponent,
} from '../../components';
import { TrackService } from '../../../shared/services/track.service';
import { CurrentUserService } from '@core-services';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  public users: User[];
  public deletedUsers: User[];
  public roles: Role[];
  public invitedUsers: User[];
  public errors: any = [];

  private sorting = {
    sortBy: '',
    sortOrder: ''
  };
  private destroy$ = new Subject();

  constructor(private usersService: UsersService,
              private currentUser: CurrentUserService,
              private modalService: BsModalService,
              public ts: TrackService,
              private notifierService: NotifierService,
              private router: Router) {}

  ngOnInit() {
    this.usersService
      .getUsersList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        this.users = x.users;
        this.roles = x.roles;
        this.deletedUsers = x.deletedUsers;
        this.invitedUsers = x.invitedUsers;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public notifier(): void {
    this.notifierService.notify('success', 'Copied link form-invite');
  }

  public redirectInvite(id?: number): void {
    if (id) {
      this.router.navigate(['/admin/edit-invite', id]);
    } else {
      this.router.navigate(['/admin/create-invite']);
    }
  }

  public sortByColumn(columnOne: string, arraySort: Array<User>): void {
    this.changeSort(columnOne);
    if (this.sorting.sortOrder === 'asc') {
      arraySort.sort((a, b) => {
        if (columnOne === 'roles') {
          return this.sortBy(a[columnOne][0].name, b[columnOne][0].name);
        }
        return this.sortBy(a[columnOne], b[columnOne]);
      });
    } else {
      arraySort.sort((a, b) => {
        if (columnOne === 'roles') {
          return this.sortBy(b[columnOne][0].name, a[columnOne][0].name);
        }
        return this.sortBy(b[columnOne], a[columnOne]);
      });
    }
  }

  private changeSort(column: string): void {
    if (column === this.sorting.sortBy) {
      if (this.sorting.sortOrder === 'asc') {
        this.sorting.sortOrder = 'desc';
      } else {
        this.sorting.sortOrder = 'asc';
      }
    } else {
      this.sorting.sortBy = column;
      this.sorting.sortOrder = 'asc';
    }
  }

  private sortBy(a: string, b: string): number {
    a = a || '';
    b = b || '';

    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  }

  public isSortingColumn(sortBy: string, sortOrder?: string): boolean {
    return !sortOrder && this.sorting.sortBy === sortBy ||
      sortOrder && this.sorting.sortBy === sortBy &&
      this.sorting.sortOrder === sortOrder;
  }

  public editUser(user: User): void {
    const initialState = {
      userId: user.id
    };

    const modal = this.modalService.show(UserEditComponent, { initialState });
    modal.content
      .onUserUpdate
      .pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        user._fromJSON(x._toJSON());
        modal.hide();
      });
  }

  public removeUser(user: User): void {
    const initialState = { user };
    const modal = this.modalService.show(UserDeleteComponent, { initialState });

    modal.content
      .onUserDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.users.splice(this.users.indexOf(user), 1);
        if (!user.invitationToken) {
          this.deletedUsers.push(user);
        }
        modal.hide();
      });
  }

  public removeUserInvited(user: User): void {
    const initialState = { user };
    const modal = this.modalService.show(InvitedDeleteComponent, { initialState });

    modal.content
      .onUserInvitedDelete
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.usersService.getUsersList())
      )
      .subscribe(users => {
        this.invitedUsers = users.invitedUsers;
        modal.hide();
      });
  }

  public impersonateUser(user: User): void {
    this.currentUser.impersonateUser(user)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => window.location.reload());
  }

  public restoreUser(user: User): void {
    this.usersService
      .restoreUser(user)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.deletedUsers.splice(this.deletedUsers.indexOf(user), 1);
        this.users.push(user);
      });
  }

  public formTooltip(tooltip: string, size: number): string {
    return tooltip.length > size ? tooltip : null;
  }
}
