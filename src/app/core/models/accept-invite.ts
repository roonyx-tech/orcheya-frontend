import { Model, Alias } from 'tsmodels';

export class OnboardingSteps extends Model {
  @Alias() public id: number;
  @Alias() public read: boolean;
  @Alias() public name?: string;
  @Alias() public kind?: string;
  @Alias() public link?: string;

  constructor(response?: any) {
    super();

    if (response) {
      this._fromJSON(response);
    }
  }
}

export class Onboarding extends Model {
  @Alias() public id: number;
  @Alias('gmail_login') public gmailLogin?: string;
  @Alias('gmail_password') public gmailPassword?: string;
  @Alias('onboarding_steps', OnboardingSteps) public onboardingSteps: OnboardingSteps[];
}

export class InvitationRespone extends Model {
  @Alias() public id: number;
  @Alias() public name: string;
  @Alias() public surname: string;
  @Alias('invitation_token') public invitationToken: string;
  @Alias('onboarding', Onboarding) public onboarding: Onboarding;

  constructor(response?: any) {
    super();

    if (response) {
      this._fromJSON(response);
    }
  }

  get fullName(): string {
    return `${this.name} ${this.surname}`;
  }
}

export class ProcessedOnboarding extends Model {
  @Alias() public id: number;
  @Alias('onboarding_steps_attributes', OnboardingSteps) public onboardingStepsAttributes: OnboardingSteps[];

  constructor(response?: any) {
    super();

    if (response) {
      this._fromJSON(response);
    }
  }
}

export class InviteUser extends Model {
  @Alias() public password: string;
  @Alias('onboarding_attributes', ProcessedOnboarding) public onboardingAttributes: ProcessedOnboarding;

  constructor(response?: any) {
    super();

    if (response) {
      this._fromJSON(response);
    }
  }
}
