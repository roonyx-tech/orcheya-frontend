import { Alias, Model } from 'tsmodels';
import { Worklog } from './worklog';
import * as moment from 'moment';
import { Moment } from 'moment';

export class TimesheetRow extends Model {
  @Alias() public id: number;
  @Alias() public name: string;
  @Alias() public surname: string;
  @Alias('all_worklogs') public all: Worklog[];
  @Alias('paid_worklogs') public paid: Worklog[];
  @Alias('plan') public plan: Worklog[];

  public total(key: string): number {
    return this[key]
      .map(e => e.time)
      .reduce((acc, time) => acc + time, 0);
  }

  public unitTotal(key: string, item: Moment, unit: moment.unitOfTime.Base): number {
    return this[key]
      .filter(e => moment(e.date).isSame(moment(item), unit))
      .map(e => e.time)
      .reduce((acc, time) => acc + time, 0);
  }
}
