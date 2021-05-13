import { Alias } from 'tsmodels';

export class Worklog {
  @Alias() public date: string;
  @Alias('task_name') public taskName: string;
  @Alias('task_url') public taskUrl: string;
  @Alias() public title: string;
}
