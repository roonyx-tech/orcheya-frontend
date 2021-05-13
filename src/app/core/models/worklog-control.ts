import { Alias, Model } from 'tsmodels';
import { User } from './user';
import { Project } from './project';

export interface IWorklogControlRequest {
  id?: number;
  from_user_id: number;
  to_user_id: number;
  project_id: number;
  started_at: string;
  ended_at: string;
}

export class WorklogControl extends Model {
  @Alias() public id: number;
  @Alias() public project: Project;
  @Alias('to_user', User) public toUser: User;
  @Alias('from_user', User) public fromUser: User;
  @Alias('started_at') public startedAt: string;
  @Alias('ended_at') public endedAt: string;

  constructor(worklogControl?: any) {
    super();

    if (worklogControl) {
      this._fromJSON(worklogControl);
    }
  }

  get getRequest(): IWorklogControlRequest {
    const object = {
      id: this.id || null,
      from_user_id: this.fromUser.id || null,
      project_id: this.project.id || null,
      to_user_id: this.toUser.id || null,
      started_at: this.startedAt || null,
      ended_at: this.endedAt || null
    };

    return object;
  }
}
