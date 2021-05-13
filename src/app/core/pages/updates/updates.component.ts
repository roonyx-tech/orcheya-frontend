import {
  Component, Inject, Input, OnDestroy, OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import {
  UpdateService, UpdatesResponse, CurrentUserService
} from '../../services';
import { UpdateFilter, User, Update } from '@models';
import { WithoutUpdate } from '../../models/without-update';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['../../pages/updates/updates.component.scss']
})

export class UpdatesComponent implements OnInit, OnDestroy {
  @Input() public user: User;
  @Input() public hideProjectFilter = false;
  @Input() public infinity = true;

  public searchInput$ = new Subject<string>();
  public data: UpdatesResponse;
  public usersWithoutUpdates: WithoutUpdate = new WithoutUpdate();
  public filterDate: Array<string>;
  public enough = false;
  public enoughWithout = false;
  public radioValue = {
    noUpdates: 'No updates',
    updates: 'Updates',
    statistics: 'Sctatistics',
  };
  public updateTab: string = this.radioValue.updates;

  private destroy$ = new Subject();
  private updateDatesPeriod = {
    earliest: moment(),
    latest: moment(),
  };
  private filter = new UpdateFilter();
  private redLabelDate: string;

  constructor(
    private updateService: UpdateService,
    private currentUser: CurrentUserService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  ngOnInit() {
    if (this.user) {
      this.filter.userIds = [this.user.id];
    }

    this.fetchUpdates();
    this.fetchUpdates('noUpdate');
    this.routerHandler();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onIntersection({ visible }): void {
    if (!visible || this.enough || this.enoughWithout) { return; }
    this.filter.page += 1;
    if (this.updateTab === this.radioValue.updates) {
      this.updateService
        .getUpdates(this.filter)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data.meta.pages.current < data.meta.pages.total) {
            this.data.updates = [...this.data.updates, ...data.updates];
            this.getMinMaxUpdatesDate(this.data.updates);
          } else {
            this.enough = true;
          }
        }
        )
        ;
    } else {
      this.updateService
        .getNoUpdates(this.filter)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: WithoutUpdate) => {
          if (data.meta.pages.current <= data.meta.pages.total) {
            this.usersWithoutUpdates.noUpdates = [...this.usersWithoutUpdates.noUpdates, ...data.noUpdates];
          } else {
            this.enoughWithout = true;
          }
        })
        ;
    }
  }

  public showDate(strDate: string, format: string = 'YYYY-MM-DD'): string {
    return moment(strDate).format(format);
  }

  public onUserChange(users: Array<User>): void {
    this.filter.userIds = users.map(user => user.id);
    this.resetFilterPage();

    this.fetchUpdates();
    this.fetchUpdates('noUpdates');
  }

  public onDateChange(): void {
    this.filter.startDate = this.filterDate
      ? this.showDate(this.filterDate[0]) : null;

    this.filter.endDate = this.filterDate
      ? this.showDate(this.filterDate[1]) : null;

    this.resetFilterPage();
    this.fetchUpdates();
    this.fetchUpdates('noUpdates');
  }

  public isShouldShowRedLabel(update: Update): boolean {
    let result = false;
    const updateDate = this.showDate(update.date);
    if (updateDate !== this.redLabelDate) {
      this.redLabelDate = updateDate;
      result = true;
    }

    if (update.id === this.data.updates[this.data.updates.length - 1].id) {
      this.redLabelDate = null;
    }

    return result;
  }

  public goToProfile(id: number): void {
    const path = this.currentUser.id === id
      ? ['/profile']
      : ['/user-profile', id];

    this.router.navigate(path);
  }

  public fetchUpdates(noUpdate?: string): void {
    if (noUpdate) {
      this.updateService
        .getNoUpdates(this.filter)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: WithoutUpdate) => {
          if (data.meta.pages.current <= data.meta.pages.total) {
            this.usersWithoutUpdates = data;
          } else if (data.meta.pages.total === 0) {
            this.usersWithoutUpdates.noUpdates = [];
            this.enoughWithout = true;
          } else {
            this.enoughWithout = true;
          }
        })
        ;
    } else {
      this.updateService
        .getUpdates(this.filter)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.data = data;
          if (data.meta.pages.current < data.meta.pages.total) {
            this.data.updates = [...this.data.updates, ...data.updates];
            this.getMinMaxUpdatesDate(this.data.updates);
          } else {
            this.enough = true;
          }
        })
        ;
    }
  }

  private getMinMaxUpdatesDate(updates: Array<Update>): void {
    this.updateDatesPeriod.earliest = moment.min(updates.map(update => moment(update.date)));
    this.updateDatesPeriod.latest = moment.max(updates.map(update => moment(update.date)));
  }

  private resetFilterPage(): void {
    this.filter.page = 1;
    this.usersWithoutUpdates.noUpdates = [];
    this.enough = this.enoughWithout = false;
  }

  private routerHandler(): void {
    const elem = this.document.querySelector('.wrapper');

    this.router.onSameUrlNavigation = 'reload';
    this.router.events.subscribe(e => {
      if (!(e instanceof NavigationEnd)) {
        return;
      }

      elem.scrollTo(0, 0);
    });
  }
}
