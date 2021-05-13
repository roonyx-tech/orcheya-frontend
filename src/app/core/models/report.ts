import { Alias, Model } from 'tsmodels';
import { Project } from './project';

export class Report extends Model {
  @Alias() public id: number;
  @Alias() public text: string;
  @Alias() public project: Project;
  @Alias('project_id') public projectId: number;
  @Alias('started_at') public startedAt: string;
  @Alias('ended_at') public endedAt: string;

  constructor(report?: any) {
    super();

    if (report) {
      this._fromJSON(report);
    }
  }

  get linkForReport(): string {
    return `${
      window.location.origin
    }/report/${
      this.id
    }?project=${this.projectId}`;
  }
}
