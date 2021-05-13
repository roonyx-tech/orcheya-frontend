import { Alias, Model } from 'tsmodels';
import { Role } from './role';

export class Document extends Model {
  @Alias() public id: number;
  @Alias() public name: string;
  @Alias() public link: string;
  @Alias() public default?: boolean;
  @Alias() public kind: string;
  @Alias() public roles?: Array<Role>;
  @Alias('role_ids') public roleIds?: Array<number>;
  @Alias('step_id') public stepId: number;
  @Alias() public read?: boolean;
  @Alias() public status?: boolean;

  constructor(document?: any) {
    super();

    if (document) {
      this._fromJSON(document);
    }
  }
}

export class OnboardingAttributes extends Model {
  @Alias() public id?: number;
  @Alias('gmail_login') public gmailLogin: string;
  @Alias('gmail_password') public gmailPassword: string;
  @Alias('step_ids') public stepIds: Array<number>;
  @Alias('steps_attributes') public stepsAttributes?: Array<CreateDocument>;

  // update invited
  @Alias('onboarding_steps', Document) public onboardingSteps?: Array<Document>;

  constructor(onboarding?: any) {
    super();

    if (onboarding) {
      this._fromJSON(onboarding);
    }
  }
}

export class Invite extends Model {
  @Alias() public name: string;
  @Alias() public surname: string;
  @Alias() public sex: string;
  @Alias('role_ids') public role: Array<number>;
  @Alias('employment_at') public employmentAt: Date;
  @Alias('working_hours') public workingHours: number;
  @Alias() public email: string;
  @Alias('onboarding_attributes', OnboardingAttributes) public onboardingAttributes: OnboardingAttributes;

  // update invited
  @Alias('onboarding', OnboardingAttributes) public onboarding?: OnboardingAttributes;
  @Alias('invitation_url') public invite?: string;
  @Alias('roles') public roles: Array<Role>;

  constructor(invite?: any) {
    super();

    if (invite) {
      this._fromJSON(invite);
    }
  }
}

export interface FormedIntegration {
  name: string;
  disabled: boolean;
}

export interface WorkDocument {
  default: Array<Document>;
  byRole: Array<Document>;
  insert?: Array<CreateDocument>;
}

export interface CreateDocument {
  name: string;
  link: string;
  kind: string;
  status?: boolean;
}

export interface Groups {
  title: string;
  checkbox: Array<Document>;
}
