import { Alias, Model } from 'tsmodels';

export class AmountWorkers extends Model {
  @Alias() public users: number;
  @Alias() public year: string;
  @Alias() public month?: string;

  constructor(amountWorkers?: any) {
    super();

    if (amountWorkers) {
      this._fromJSON(amountWorkers);
    }
  }
}
