import { Alias, Model  } from 'tsmodels';
import { User } from './user';

export class Project extends Model {
  @Alias() public id: number;
  @Alias() public name: string;
  @Alias() public title: string;
  @Alias() public paid: boolean;
  @Alias() public archived: boolean;
  @Alias() public platform: string;
  @Alias('manager_id') public managerId: number;
  @Alias() public manager: User;
  @Alias('created_at') public createdAt: Date;

  constructor(project?: any) {
    super();

    if (project) {
      this._fromJSON(project);
    }
  }
}
