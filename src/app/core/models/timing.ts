import { Alias, Model } from 'tsmodels';
import * as moment from 'moment';
import { Moment } from 'moment';

export class Timing extends Model {
  @Alias() public id: number;
  @Alias('from') public start: Moment;
  @Alias('to') public end: Moment;
  @Alias('flexible') public isFlexible: boolean;
  @Alias('users_count') usersCount: number;

  static build(from: Moment, to: Moment): Timing {
    const timing = new Timing();
    timing.start = from;
    timing.end = to;
    return timing;
  }

  get time(): string {
    if (this.isFlexible) {
      return `flexible`;
    } else {
      const start = moment(this.start).format('HH:mm');
      const end = moment(this.end).format('HH:mm');
      return `${start} - ${end}`;
    }
  }
}
