import { Alias, Model } from 'tsmodels';

export class ProjectsTableRow extends Model {
  @Alias() public id: number;
  @Alias() public name: number;
  @Alias() public time: number;
  @Alias() public paid: number;
}
