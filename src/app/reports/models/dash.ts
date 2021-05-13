import { Alias, Model } from 'tsmodels';

export class Dash extends Model {
  @Alias() public workdays: number;
  @Alias() public developers: number;
  @Alias() public other: number;
  @Alias() public hours: number;
  @Alias('worked_hours') public workedHours: number;
  @Alias('paid_hours') public paidHours: number;
  @Alias('total_paid') public totalPaid: number;
  @Alias('active_projects') public activeProjects: number;
  @Alias('paid_projects') public paidProjects: number;
}
