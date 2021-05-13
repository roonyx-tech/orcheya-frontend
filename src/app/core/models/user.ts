import { Alias, Model } from 'tsmodels';
import { Image } from './image';
import { Role } from './role';
import { Timing } from './timing';
import { Notification } from './notification';
import { AchievementUser } from './achievement-user';
import { Permission } from './permission';
import { UserSkill } from './user-skill';
import { UserWorktime } from './user-worktime';

export interface IUsersIndex {
  users: User[];
  deletedUsers?: User[];
  roles: Role[];
  invitedUsers: User[];
}

export interface IUserEdit {
  user?: User;
  timings?: Timing[];
  roles?: Role[];
}

export class User extends Model {
  @Alias() public id: number;
  @Alias() public email: string;
  @Alias() public name: string;
  @Alias() public surname: string;
  @Alias() public title: string;
  @Alias() public sex: string;
  @Alias() public birthday: string;
  @Alias() public phone: string;
  @Alias() public skype: string;
  @Alias() public about: string;
  @Alias('invitation_url') public invite?: string;
  @Alias('timing_id') public timingId: number;
  @Alias('available_vacations_days') public availableVacationsDays: number;
  @Alias('vacations_days_available') public vacationsAvailableDays: number;
  @Alias('vacation_days_used') public vacationDaysUsed: number;
  @Alias('vacation_notifier_disabled') public vacationNotifier: boolean;
  @Alias('timing', Timing) public timing: Timing;
  @Alias('role_id') public roleId: number;
  @Alias('employment_at') public employmentAt: string;
  @Alias('working_hours') public workingHours: number;
  @Alias('avatar', Image) public avatar: Image;
  @Alias('slack_connected') public slackConnected: boolean;
  @Alias('timedoctor_connected') public timedoctorConnected: boolean;
  @Alias('discord_connected') public discordConnected: boolean;
  // @Alias('agreement_accepted') public agreementAccepted: boolean;
  @Alias('registration_finished') public registrationFinished: boolean;
  @Alias('notify_update') public notifyUpdate: boolean;
  @Alias('discord_notify_update') public discordNotifyUpdate: boolean;
  @Alias('invitation_token') public invitationToken: string;
  @Alias('notifications', Notification) public notifications: Notification[];
  @Alias('slack_id') public slackId: string;
  @Alias('discord_id') public discordId: string;
  @Alias('discord_name') public discordName: string;
  @Alias('slack_team_id') public slackTeamId: string;
  @Alias('slack_name') public slackName: string;
  @Alias('deleted_at') public deletedAt: Date;
  @Alias('roles', Role) public roles: Role[];
  @Alias('permissions', Permission) public permissions: Permission[] = [];
  @Alias('users_skills', UserSkill) public userSkills: UserSkill[];
  @Alias() public wallet?: number;
  @Alias('english_level') public englishLevel: number;
  @Alias('last_english_update') public lastEnglishUpdate: string;
  @Alias('new_vacation_days') public newVacationDays?: string;
  @Alias('favorite_achievement', AchievementUser) public favoriteAchievement?: AchievementUser;
  @Alias('name_cyrillic') public nameCyrillic?: string;
  @Alias('worktime', UserWorktime) public workTime?: UserWorktime;

  constructor(user?) {
    super();

    if (user) {
      this._fromJSON(user);
    }
  }

  get fullName(): string {
    return `${this.name} ${this.surname}`;
  }

  public isRegistered(): boolean {
    return !this.invitationToken;
  }
}
