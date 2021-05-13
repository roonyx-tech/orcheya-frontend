import { Model, Alias } from 'tsmodels';

export class SkillUpdate extends Model {
  @Alias() public id: number;
  @Alias('users_skill_id') public usersSkillId: number;
  @Alias('skill_id') public skillId: number;
  @Alias() public level: number;
  @Alias() public approved: boolean;
  @Alias('approver_id') public approverId: number;
  @Alias() public comment: string;
  @Alias('updated_at') public updatedAt: Date;

  constructor(skillUpdate?: any) {
    super();

    if (skillUpdate) {
      this._fromJSON(skillUpdate);
    }
  }
}
