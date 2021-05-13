import { Alias } from 'tsmodels';

export class Worklog {
  @Alias() public date: string;
  @Alias() public time: number;
}
