import { Alias, Model } from 'tsmodels';
import { Permission } from './permission';

export class Role extends Model {
  @Alias() public id: number;
  @Alias() public name = '';
  @Alias('users_count') public usersCount: number;
  @Alias('permissions') public permissions: Permission[];

  public hasPermission(subject: string, action: string): boolean {
    return this.permissions.some(permission => permission.subject === subject && permission.action === action);
  }
}
