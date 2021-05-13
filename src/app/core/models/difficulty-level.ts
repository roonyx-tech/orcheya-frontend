import { Alias, Model } from 'tsmodels';

export class DifficultyLevel extends Model {
  @Alias() public id: number;
  @Alias() public title: string;
  @Alias() public value: number;

  constructor(difficultyLevel?: any) {
    super();

    if (difficultyLevel) {
      this._fromJSON(difficultyLevel);
    }
  }
}
