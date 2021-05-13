import { Alias, Model } from 'tsmodels';
import { User } from './user';

export class Participants extends Model {
  @Alias() public id: number;
  @Alias() public done: boolean;
  @Alias() public user: User;
}
