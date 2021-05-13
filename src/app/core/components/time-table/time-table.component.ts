import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import * as moment from 'moment';

import { ProjectProgress, DateProjectProgress, TimeActivity } from '../../models';
import { takeUntil } from 'rxjs/operators';
import { UserWorktimeService } from '@core-services';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface Month {
  title: string;
  position: number;
  year?: number;
  start?: moment.Moment;
  end?: moment.Moment;
  countDays?: number;
  countWeeks?: number;
  weeks?: Week[];
}

interface Week {
  days: Day[];
  position: number;
  totalMinutes: number;
  totalText: string;
  start?: moment.Moment;
  end?: moment.Moment;
}

interface Day {
  title?: string;
  position: number;
  isoPosition: number;
  date?: moment.Moment;
  textTime?: string;
  minutes?: number;
  day?: string;
}

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.scss']
})
export class TimeTableComponent implements OnChanges, OnInit, OnDestroy {
  @Input() private yearTime: TimeActivity[];
  @Input() private userId: number;
  public width = '100%';
  public months: Month[] = [
    { title: 'December', position: 11 },
    { title: 'November', position: 10 },
    { title: 'October', position: 9 },
    { title: 'September', position: 8 },
    { title: 'August', position: 7 },
    { title: 'July', position: 6 },
    { title: 'June', position: 5 },
    { title: 'May', position: 4 },
    { title: 'April', position: 3 },
    { title: 'March', position: 2 },
    { title: 'February', position: 1 },
    { title: 'January', position: 0 },
  ];
  public currentMonth = new Date().getMonth();
  public selectedMonth: Month;
  public totalMonthTime: string;
  public nowMonth = new Date().getMonth();
  public nowWeek: number;
  public colorProgressBar: Array<string> =
    ['#00ceff', '#ff2400', '#00fffd', '#0084ff', '#00ff00', '#eeff00', '#7038ad', '#faffce', '#000', '#c900c9'];
  public projects: Array<ProjectProgress> = [];
  public environment = environment.environment;

  private destroy$ = new Subject();

  constructor(private worktime: UserWorktimeService) {}

  private static convertTime(time: number): string {
    if (!time) {
      return '-';
    }

    const hours = Math.floor(time / 60);
    const minutes = time % 60;

    return `${hours}h ${minutes}m`;
  }

  private static getWeekPositionOfMonth(date: Date): number {
    const firstMonthDate = moment(date).startOf('month');

    return moment().week() - firstMonthDate.week();
  }

  ngOnInit(): void {
    this.getProgressBar();
  }

  ngOnChanges(changes) {
    if (!this.yearTime) {
      this.yearTime = [];
    }
    this.calcTime();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onChange(value: string) {
    this.currentMonth = +value;
    this.selectedMonth = this.months
      .find(month => month.position === this.currentMonth);

    this.colorProgressBar =
      ['#00ceff', '#ff2400', '#00fffd', '#0084ff', '#00ff00', '#eeff00', '#7038ad', '#faffce', '#ffffff', '#c900c9'];
    this.getProgressBar();
    this.setTotalMonthTime();
  }

  private getProgressBar(): void {
    const dateProgressBar: DateProjectProgress = {
      start_date: moment([this.selectedMonth.year, this.currentMonth]).format('Y-MM-DD'),
      finish_date: moment([this.selectedMonth.year, this.currentMonth]).endOf(`month`)
        .format('Y-MM-DD')
    };

    this.worktime.loadPercent(this.userId, dateProgressBar)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.projects = [];
        Object.keys(data.workingTimeByProjects).forEach(key => {
          const project: ProjectProgress = {
            name: key,
            percent: `${Math.round(data.workingTimeByProjects[key])}`,
            color: this.getRandomColor()
          };
          this.projects.push(project);
        });
      });
  }

  private getRandomColor(): string {
    const selectColor = this.colorProgressBar[Math.floor(Math.random() * this.colorProgressBar.length)];
    this.colorProgressBar.splice(this.colorProgressBar.indexOf(selectColor), 1);
    return selectColor;
  }

  private setTotalMonthTime() {
    const strDate = moment([this.selectedMonth.year, this.currentMonth])
      .format('Y-MM');

    let minutes = 0;
    this.yearTime
      .filter(d => d.date.indexOf(strDate) === 0)
      .forEach(d => minutes += d.time);

    this.totalMonthTime = TimeTableComponent.convertTime(minutes);
  }

  private updateMonthsData() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    this.months = this.months
      .map(month => {
        month.year = currentMonth >= month.position
          ? currentYear : currentYear - 1;

        month.start = moment(new Date(month.year, month.position, 1))
          .startOf('isoWeek');

        month.end = moment(new Date(month.year, month.position, 1))
          .endOf('month')
          .endOf('isoWeek');

        month.countDays = month.end.diff(month.start, 'days') + 1;
        month.countWeeks = month.countDays / 7;

        this.updateWeeksData(month);

        if (month.position === this.currentMonth) {
          this.selectedMonth = month;
        }

        return month;
      });
  }

  private updateWeeksData(month: Month) {
    month.weeks = [];

    new Array(month.countWeeks)
      .fill(null)
      .forEach((_, index) => {
        const week: Week = {
          days: [],
          position: index,
          totalMinutes: 0,
          totalText: '0',
        };

        week.start = index
          ? moment(month.start.valueOf()).add(index * 7, 'days')
          : moment(month.start.valueOf());

        week.end = index - 1 === month.countWeeks
          ? moment(month.end.valueOf())
          : moment(month.end.valueOf())
            .subtract((month.countWeeks - index - 1) * 7, 'days');

        this.updateDaysDate(week);

        month.weeks.push(week);
      });
  }

  private updateDaysDate(week: Week) {
    new Array(7)
      .fill(null)
      .forEach((_, index) => {
        const day: Day = {
          position: index,
          isoPosition: index + 1,
        };

        day.date = moment(week.start.valueOf()).add(index, 'days');
        day.day = day.date.format('D');
        day.title = day.date.format('dddd');
        day.textTime = day.date.format();

        const dataDay = this.yearTime
          .find(d => d.date === day.date.format('Y-MM-DD'));

        day.minutes = dataDay ? dataDay.time : 0;
        day.textTime = TimeTableComponent.convertTime(day.minutes);

        week.totalMinutes += day.minutes;
        week.days.push(day);
      });

    week.totalText = TimeTableComponent.convertTime(week.totalMinutes);
  }

  private calcTime() {
    this.nowWeek = TimeTableComponent.getWeekPositionOfMonth(new Date());
    this.updateMonthsData();
    this.setTotalMonthTime();
  }

  public sortByOrder(months: Month[]): Month[] {
    const shift = 12 - (this.nowMonth + 1);
    return months.slice(shift)
      .concat(months.slice(0, shift));
  }
}
