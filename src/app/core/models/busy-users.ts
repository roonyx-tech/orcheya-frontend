import { User } from './user';
import { CalendarEvent, EventTag } from './calendar-event';
import { Alias, Model } from 'tsmodels';

export class TagUser extends Model {
  @Alias('tag') public tag: EventTag;
  @Alias('users', User) public users: User[];
}

export class SoonUser extends Model {
  @Alias('date') date: Date;
  @Alias('user', User) public user: User;
}

export class BusyResponse extends Model {
  @Alias('free', User) public free?: User[];
  @Alias('tags', TagUser) public tags?: TagUser[];
  @Alias('soon', SoonUser) public soon?: SoonUser[];
  @Alias('vacations', CalendarEvent) public vacations?: CalendarEvent[];

  constructor(response?: any) {
    super();

    if (response) {
      this._fromJSON(response);
    }
  }
}
