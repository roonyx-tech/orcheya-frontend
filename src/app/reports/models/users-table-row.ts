import { Alias, Model } from 'tsmodels';

export class UsersTableRow extends Model {
  @Alias() public id: number;
  @Alias() public name: string;
  @Alias() public surname: string;
  @Alias() public worked: number;
  @Alias() public paid: number;
  @Alias() public time: number;
  @Alias() public load: number;
}
