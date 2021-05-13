import { Component, OnInit } from '@angular/core';
import { UpdateService } from '@core-services';
import { UpdateStatistics } from '@models';
import * as moment from 'moment';

const DEFAULT_FORMAT = 'YYYY-MM-DD';

@Component({
  selector: 'app-update-statistics',
  templateUrl: './update-statistics.component.html',
  styleUrls: ['./update-statistics.component.scss']
})
export class UpdateStatisticsComponent implements OnInit {
  public isLoading = false;
  public filterDate: string[];
  public statistics: Array<{name: string, value: number}>;

  private period = {
    startDate: moment().subtract(7, 'days').format(DEFAULT_FORMAT),
    endDate: moment().format(DEFAULT_FORMAT),
  };

  constructor(
    public updateService: UpdateService,
  ) { }

  ngOnInit() {
    this.fetchData(this.period);
  }

  public textTitle(): string {
    return `Period: ${moment(this.period.startDate).format('ll')} to
              ${moment(this.period.endDate).format('ll')} (Percent of users with updates)`;
  }

  private fetchData(period: { startDate: string, endDate: string }): void {
    this.isLoading = true;
    this.updateService.getUpdateStatistics(period.startDate, period.endDate)
      .subscribe((statistics: UpdateStatistics[]) => {
        this.statistics = this.formDataGraph(statistics);
        this.isLoading = false;
      });
  }

  private formDataGraph(statistics: UpdateStatistics[]): Array<{name: string, value: number}> {
    return statistics.map(element => {
      return {
        name: `${moment(element.date).format('ll')}`,
        value: +element.completePercent.toFixed(2)
      };
    });
  }

  public onDateChange(): void {
    if (this.filterDate) {
      this.period = {
        startDate: moment(this.filterDate[0]).format(DEFAULT_FORMAT),
        endDate:  moment(this.filterDate[1]).format(DEFAULT_FORMAT),
      };
    } else {
      this.period = {
        startDate: moment().subtract(7, 'days').format(DEFAULT_FORMAT),
        endDate: moment().format(DEFAULT_FORMAT),
      };
    }

    this.fetchData(this.period);
  }
}
