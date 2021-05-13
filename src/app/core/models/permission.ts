import { Alias, Model } from 'tsmodels';

export class PermissionSubject extends Model {
  @Alias() public name: string;
  @Alias() public title: string;
  @Alias() public description: string;
  @Alias() public actions: Permission[];
}

export class Permission extends Model {
  @Alias() public id: number;
  @Alias() public subject: string;
  @Alias() public action: string;
  @Alias() public description: string;
}
