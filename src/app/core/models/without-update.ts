import { Model, Alias } from 'tsmodels';
import { User, Meta } from '@models';

export class UserWithoutUpdate extends Model {
  @Alias() public date: string;
  @Alias('users_without_update', User) public usersWithoutUpdate: Array<User>;

  constructor(userWithoutUpdate?: any) {
    super();

    if (userWithoutUpdate) {
      this._fromJSON(userWithoutUpdate);
    }
  }
}

export class WithoutUpdate extends Model {
  @Alias() public meta: Meta;
  @Alias('no_updates', UserWithoutUpdate) public noUpdates: Array<UserWithoutUpdate>;

  constructor(withoutUpdate?: any) {
    super();

    if (withoutUpdate) {
      this._fromJSON(withoutUpdate);
    }
  }
}


