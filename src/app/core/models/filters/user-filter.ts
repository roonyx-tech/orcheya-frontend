import { Alias, Model } from 'tsmodels';

export class UserFilter extends Model {
  @Alias() public page?: number;
  @Alias() public limit?: number;
  @Alias() public search?: string;
  @Alias() public total?: number;
  @Alias('role_is') public roleIs?: number;

  constructor(data?: any) {
    super();

    this.page = 1;
    this.limit = 25;

    if (data) {
      this._fromJSON(data);
    }
  }
}
