import { Alias, Model } from 'tsmodels';
import { User } from './user';
import { RegexpHelper } from '../../shared/helpers';
import { Project } from './project';

export class Update extends Model {
  @Alias() public id: number;
  @Alias('user', User) public user: User;
  @Alias() public date: string;
  @Alias() public made: string;
  @Alias() public planning: string;
  @Alias() public issues: string;
  @Alias('projects', Project) public projects: Project[];
  @Alias('created_at') public createdAt: string;

  constructor(update?: any) {
    super();

    if (update) {
      this._fromJSON(update);
      this.checkLinks();
    }
  }

  private checkLinks() {
    const made = RegexpHelper.matchUrlsForSlack(this.made);
    const planning = RegexpHelper.matchUrlsForSlack(this.planning);
    const issues = RegexpHelper.matchUrlsForSlack(this.issues);

    if (made) {
      this.made = RegexpHelper
        .getReplacedSlackUrls(this.made, made);
    }

    if (planning) {
      this.planning = RegexpHelper
        .getReplacedSlackUrls(this.planning, planning);
    }

    if (issues) {
      this.issues = RegexpHelper
        .getReplacedSlackUrls(this.issues, issues);
    }
  }
}
