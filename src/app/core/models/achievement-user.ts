import { Alias, Model } from 'tsmodels';

interface Image {
  url: string;
}

export class AchievementUser extends Model {
  @Alias() public id: number;
  @Alias('user_id') public userId: number;
  @Alias('achievement_id') public achievementId: number;
  @Alias('achievement_title') public achievementTitle: string;
  @Alias('created_at') public createAt: string;
  @Alias('kind') public kind: string;
  @Alias('level_title') public levelTitle: number;
  @Alias('next_level_score') public nextLevelScore: number;
  @Alias() public score: number;
  @Alias() public level: number;
  @Alias() public color: string;
  @Alias('second_color') public secondColor: string;
  @Alias('third_color') public thirdColor: string;
  @Alias() public image: Image;
  @Alias('best_result') public bestResult: number;


  constructor(achievementUser?: any) {
    super();

    if (achievementUser) {
      this._fromJSON(achievementUser);
    }
  }
}

export class UpdateFavoriteAchievement extends Model {
  @Alias('users_achievement', AchievementUser) public usersAchievement: AchievementUser;

  constructor(favoriteAchievement?: any) {
    super();

    if (favoriteAchievement) {
      this._fromJSON(favoriteAchievement);
    }
  }
}
