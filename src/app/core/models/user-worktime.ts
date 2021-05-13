import { Model, Alias } from 'tsmodels';

export class UserWorktime extends Model {
  @Alias('working_time') public workingTime: number;
  @Alias('worked_out') public workedOut: number;
  @Alias('balance') public balance: number;
  @Alias('timer_on') public timerOn?: boolean;
  @Alias('start') public start: Date;
  @Alias('finish') public finish: Date;

  constructor(userWorktime?: UserWorktime) {
    super();

    if (userWorktime) {
      this._fromJSON(userWorktime);
    }
  }
}
