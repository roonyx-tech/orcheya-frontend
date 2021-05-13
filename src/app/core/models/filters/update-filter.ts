import { Alias, Model } from 'tsmodels';

export class UpdateFilter extends Model {
  @Alias() public page: number;
  @Alias() public limit: number;
  @Alias() public query?: string;
  @Alias('user_ids') public userIds?: number[];
  @Alias('project_ids') public projectIds?: number[];
  @Alias('start_date') public startDate?: string;
  @Alias('end_date') public endDate?: string;

  constructor(data?: any) {
    super();

    this.page = 1;
    this.limit = 25;

    if (data) {
      this._fromJSON(data);
    }
  }
}
