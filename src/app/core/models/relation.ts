import { Alias, Model } from 'tsmodels';

export class Relation extends Model {
  @Alias() public name: string;
  @Alias() public surname?: string;
}
