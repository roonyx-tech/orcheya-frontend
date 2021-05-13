import { Model, Alias } from 'tsmodels';

export class UserWorktimeProjects extends Model {

  @Alias('working_time_by_projects') public workingTimeByProjects: object;

  constructor(userWorktimeByProjects?: UserWorktimeProjects) {
    super();

    if (userWorktimeByProjects) {
      this._fromJSON(userWorktimeByProjects);
    }
  }
}
