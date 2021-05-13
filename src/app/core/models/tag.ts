import { Alias, Model } from 'tsmodels';

export class Tag extends Model {
  @Alias() public id: number;
  @Alias() public name: string;
  @Alias() public kind: string;
}
