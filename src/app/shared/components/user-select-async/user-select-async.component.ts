import {
  Component, EventEmitter, Input, OnDestroy, OnInit, Output,
} from '@angular/core';
import { Observable, Observer, Subject, EMPTY } from 'rxjs';
import { expand, reduce, takeUntil } from 'rxjs/operators';
import { User, UserFilter } from '@models';
import { UsersListService, UsersListResponse } from '@core-services';

@Component({
  selector: 'app-user-select-async',
  template: `
    <ng-select [items]="users | async"
               bindLabel="fullName"
               [bindValue]="bindValue"
               placeholder="Select users"
               notFoundText="Users not found"
               class="dark-select"
               [multiple]="isMultiple"
               [typeahead]="typeAhead$"
               [closeOnSelect]="isCloseOnSelect"
               [hideSelected]="true"
               [clearSearchOnAdd]="true"
               [ngModel]="receivedUsers"
               (change)="onUserChanged($event)">
    </ng-select>
  `,
})
export class UserSelectAsyncComponent implements OnInit, OnDestroy {
  @Input() public receivedUsers: Array<User> | User;
  @Input() public isCloseOnSelect = false;
  @Input() public isMultiple = true;
  @Input() public bindValue: string;

  @Output() public selectUsers = new EventEmitter<Array<User>>();

  public users: Observable<Array<User>>;
  public typeAhead$ = new Subject<string>();

  private userFilter = new UserFilter();
  private destroy$ = new Subject<void>();

  constructor(
    private usersListService: UsersListService,
  ) {}

  ngOnInit() {
    this.getUsersList(this.userFilter);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onUserChanged(users: Array<User>): void {
    this.selectUsers.emit(users);
  }

  private getUsersList(userFilter: UserFilter): void {
    this.usersListService.getUsersList(userFilter)
      .pipe(
        expand((usersListResponse: UsersListResponse) => {
          return this.hasPages(usersListResponse) ?
            this.usersListService.getUsersList(this.getNextPage(usersListResponse)) : EMPTY;
        }),
        reduce((acc, data) => {
          acc.users.push(...data.users);
          acc.meta = data.meta;
          return acc;
        }),
        takeUntil(this.destroy$)
      ).subscribe(({ users }) => {
        this.fetchUsers(users);
      });
  }

  private hasPages(usersListResponse: UsersListResponse): boolean {
    return usersListResponse.meta.pages.total > usersListResponse.meta.pages.current;
  }

  private getNextPage(usersListResponse: UsersListResponse): UserFilter {
    return new UserFilter({
      page: usersListResponse.meta.pages.current + 1,
      total: usersListResponse.meta.pages.total,
    });
  }

  private fetchUsers(users: Array<User>): void {
    this.users = new Observable((observer: Observer<Array<User>>) => {
      observer.next(users);
      observer.complete();
    });
  }
}
