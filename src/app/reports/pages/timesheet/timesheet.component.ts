import {
  Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { TimesheetService } from '../../services';

import * as moment from 'moment';
import { Moment } from 'moment';

import { User } from '../../../core/models/user';
import {
  UsersListResponse,
  UsersListService
} from '../../../core/services/users-list.service';

import { TimesheetFilter, TimesheetRow, Worklog } from '../../models';
import { Role } from '../../../core/models/role';
import {
  RolesService,
} from '../../../core/services/roles.service';
import { UserFilter } from '../../../core/models/filters/user-filter';

@Component({
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {
  public users = new Array<User>();
  public roles: Array<Role>;
  public paid: boolean;
  public groupByWeek = false;

  public today = moment();
  public days: Array<Moment>;
  public filter = new TimesheetFilter();
  public typeahead;
  public timesheetRows: TimesheetRow[];
  private getTimesheetDelay;
  private userFilter: UserFilter = new UserFilter();

  private sorting = {
    sortBy: '',
    sortOrder: ''
  };

  constructor(
    private timesheetService: TimesheetService,
    private usersListService: UsersListService,
    private rolesService: RolesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.filter = this.timesheetService.loadFilter();
    this.fetchUsers();
    this.fetchRoles();
    this.filterChanged();
    this.setPrevious();
  }

  get timeUnit(): moment.unitOfTime.Base {
    return this.groupByWeek ? 'week' : 'day';
  }

  public getTimesheet(): void {
    const filter = new TimesheetFilter();
    filter._fromJSON(this.filter._toJSON());
    if (filter.users.length === 0 && filter.roles.length === 0) {
      filter.roles = this.roles;
    }
    this.timesheetService.getTimesheet(filter)
      .subscribe(data => {
        this.timesheetRows = data.timesheetRows;
        this.days = this.daysRange();
        this.sorting.sortBy = '';
      });
  }

  public onUserChange(users: Array<User>): void {
    if (users) {
      this.filter.users = users;
    }
    this.filterChanged();
  }

  public changeSort(column: string): void {
    if (column === this.sorting.sortBy) {
      if (this.sorting.sortOrder === 'asc') {
        this.sorting.sortOrder = 'desc';
      } else {
        this.sorting.sortOrder = 'asc';
      }
    } else {
      this.sorting.sortBy = column;
      if (this.isSortingColumn('surname')) {
        this.sorting.sortOrder = 'asc';
      } else {
        this.sorting.sortOrder = 'desc';
      }
    }
  }

  public changeSortByCountTime(): void {
    this.changeSort('countTime');
    const kind = this.paid ? 'paid' : 'all';
    this.timesheetRows
      .sort((a, b) => {
        const valueA = a.total(kind) - a.total('plan');
        const valueB = b.total(kind) - b.total('plan');
        return this.sorting.sortOrder === 'asc' ? this.sortBy(valueA, valueB) : this.sortBy(valueB, valueA);
      });
  }

  public changeSortByDate(day: Moment): void {
    this.changeSort(day.toString());
    const kind = this.paid ? 'paid' : 'all';
    this.timesheetRows
      .sort((a, b) => {
        const valueA = a.unitTotal(kind, day, this.timeUnit) - a.unitTotal('plan', day, this.timeUnit);
        const valueB = b.unitTotal(kind, day, this.timeUnit) - b.unitTotal('plan', day, this.timeUnit);
        return this.sorting.sortOrder === 'asc' ? this.sortBy(valueA, valueB) : this.sortBy(valueB, valueA);
      });
  }

  public sortByColumn(column: string): void {
    this.changeSort(column);
    if (this.sorting.sortOrder === 'asc') {
      this.timesheetRows.sort((a, b) => this.sortBy(a[column], b[column]));
    } else {
      this.timesheetRows.sort((a, b) => this.sortBy(b[column], a[column]));
    }
  }

  public sortBy(a: string | number, b: string | number): number {
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

  public daysRange(): Array<Moment> {
    const unit = this.timeUnit;
    const first = moment(this.filter.dates[0]);
    const last = moment(this.filter.dates[1]);
    const res = [];

    for (let i = 0; i <= last.diff(first, unit); i++) {
      res.push(first.clone().add(i, unit));
    }

    return res;
  }

  public formatDate(date: Moment): string {
    if (this.groupByWeek) {
      const aDate = date.clone();
      return aDate.startOf('week').format('DD.MM') + '-' +
        aDate.endOf('week').format('DD.MM');
    } else {
      return date.format('ddd, DD.MM');
    }
  }

  public total(key: string): number {
    return this.timesheetRows
      .map(e => e.total(key))
      .reduce((acc, e) => acc += e, 0);
  }

  public unitTotal(key: string, item: Moment): number {
    return this.timesheetRows
      .map(e => e.unitTotal(key, item, this.timeUnit))
      .reduce((acc, e) => acc += e, 0);
  }

  public setDates(startDate: Moment, endDate: Moment): void {
    this.filter.dates = [
      moment(startDate).toDate(),
      moment(endDate).toDate()
    ];
  }

  public setCurrent(): void {
    const unit = this.groupByWeek ? 'month' : 'isoWeek';
    this.setDates(
      moment().startOf(unit),
      moment().endOf(unit)
    );
    this.filterChanged();
  }

  public setPrevious(): void {
    const unit = this.groupByWeek ? 'month' : 'week';
    const date = moment().subtract(1, unit);
    this.setDates(
      date.clone().startOf(unit),
      date.clone().endOf(unit)
    );
    this.filterChanged();
  }

  private fetchRoles(): void {
    this.rolesService.getList().subscribe(roles => {
      this.roles = roles.filter(role => role.hasPermission('projects', 'timer'));
    });
  }

  private fetchUsers(): void {
    this.usersListService.getUsersList(this.userFilter)
      .subscribe((data: UsersListResponse) => {
        this.users = [...this.users, ...data.users];
        if (data.meta.pages.current < data.meta.pages.total) {
          this.userFilter.page++;
          this.fetchUsers();
        } else {
          this.filter.users = this.users.filter(
            user => this.filter.users.find(
              fUser => fUser.id === user.id
            )
          );
        }
      });
  }

  public filterChanged(): void {
    this.timesheetService.saveFilter(this.filter);
    clearTimeout(this.getTimesheetDelay);
    this.getTimesheetDelay = setTimeout(
      () => this.getTimesheet(),
      10
    );
  }

  public groupingChanged(): void {
    this.days = this.daysRange();
    this.cdr.detectChanges();
  }

  public trackBy(index: number, item: TimesheetRow): number {
    return item.id;
  }

  public togglePaid(): void {
    this.paid = !this.paid;
  }
}
