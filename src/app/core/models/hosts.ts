import { Alias, Model } from 'tsmodels';

export class Host extends Model {
  @Alias() public id: number;
  @Alias() public name: string;
  @Alias() public url: string;
}
