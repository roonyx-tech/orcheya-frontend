import { Alias, Model } from 'tsmodels';
import { AchievementLevel } from './achievement-level';
import { Role, User } from '@models';

export class Achievement extends Model {
  @Alias() public id?: number;
  @Alias() public kind: string;
  @Alias() public title: string;
  @Alias() public image?: string;
  @Alias() public endpoint?: string;
  @Alias() public roles?: Array<Role>;
  @Alias() public users?: Array<User>;
  @Alias('levels', AchievementLevel) public levels?: Array<AchievementLevel>;
  @Alias('created_at') public createdAt?: Date;
  @Alias('updated_at') public updatedAt?: Date;

  // for adding/editing
  @Alias('levels_attributes', AchievementLevel) public levelsAttributes?: Array<AchievementLevel>;
  @Alias('user_ids') public userIds?: Array<number>;
  @Alias('role_ids') public roleIds?: Array<number>;

  constructor(achievement?: any) {
    super();

    if (achievement) {
      this._fromJSON(achievement);
    }
  }
}
