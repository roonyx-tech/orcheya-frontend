import { Alias, Model } from 'tsmodels';
import { User } from '../../core/models/user';
import { Role } from '../../core/models/role';

export class TimesheetFilter extends Model {
  @Alias() public users: User[] = [];
  @Alias() public roles: Role[] = [];
  @Alias() public dates: Date[];
}
