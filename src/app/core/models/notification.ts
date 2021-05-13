import { Alias, Model } from 'tsmodels';
import { Moment } from 'moment';

export class Notification extends Model {
  @Alias() public id: number;
  @Alias() public text: number;
  @Alias() public importance: number;
  @Alias('readed_at') public readedAt: Moment;
  @Alias('created_at') public createdAt: Moment;
}
