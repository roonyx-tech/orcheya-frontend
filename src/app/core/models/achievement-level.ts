import { Alias, Model } from 'tsmodels';

export class AchievementLevel extends Model {
  @Alias() public id: number;
  @Alias() public from: number;
  @Alias() public to: number;
  @Alias() public name: string;
  @Alias() public color: string;
  @Alias('second_color') public secondColor: string;
  @Alias('third_color') public thirdColor: string;
  @Alias() public number: number;
  @Alias('_destroy') public destroy?: boolean;

  constructor(achievementLevel?: any) {
    super();

    if (achievementLevel) {
      this._fromJSON(achievementLevel);
    }
  }
}
