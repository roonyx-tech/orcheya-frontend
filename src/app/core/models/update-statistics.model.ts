import { Alias, Model } from 'tsmodels';

export class UpdateStatistics extends Model {
  @Alias('complete_percent') public completePercent: number;
  @Alias() public date: string;
}
