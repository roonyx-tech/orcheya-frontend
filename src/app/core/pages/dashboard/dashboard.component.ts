import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartServiceComponent } from '../../../reports/components';
import { DurationInputArg1, DurationInputArg2 } from 'moment';
import { ServiceLoadResponse, ServiceLoadService } from '../../../reports/services';
import { TrackService } from '../../../shared/services/track.service';
import * as moment from 'moment';
import { User } from '@models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CurrentUserService } from '@core-services';
import { environment } from '../../../../environments/environment';

const DATE_FORMAT = 'YYYY-MM-DD';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(ChartServiceComponent, { static: false }) chart;

  public count: DurationInputArg1 = 3;
  public kind: DurationInputArg2 = 'month';
  public step = 'week';
  public dates: Array<Date>;
  public bestUsers: Array<User>;
  public worseUsers: Array<User>;
  public positionCurrentUser: number;
  public date = moment().format('MMMM YYYY');
  public environment = environment.environment;

  private destroyed = new Subject();

  constructor(
    private serviceLoadService: ServiceLoadService,
    private cdr: ChangeDetectorRef,
    public ts: TrackService,
    public currentUser: CurrentUserService,
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public changeDates(
    data: {
      count: DurationInputArg1,
      kind: DurationInputArg2,
      dates: Array<Date>}
  ): void {
    this.kind = data.kind;
    this.count = data.count;
    this.dates = data.dates;
    this.getServiceLoad();
  }

  public beforeGetServiceLoad(): void {
    this.kind = undefined;
    this.count = undefined;
    this.getServiceLoad();
  }

  public changeStep(step: string): void {
    this.step = step;
    this.getServiceLoad();
  }

  private getServiceLoad(): void {
    const startDate = moment(this.dates[0]).format(DATE_FORMAT);
    const endDate = moment(this.dates[1]).format(DATE_FORMAT);

    this.serviceLoadService
      .getServiceLoad(startDate, endDate, this.step)
      .pipe(takeUntil(this.destroyed))
      .subscribe((data: ServiceLoadResponse) => this.chart.initGraph(data));
  }
}
