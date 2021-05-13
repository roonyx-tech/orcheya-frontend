import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CurrentUserService } from '@core-services';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import {
  OnboardingSteps,
  InvitationRespone,
  InviteUser,
  ProcessedOnboarding,
} from '@models';
import { NotifierService } from 'angular-notifier';
import { validationMessage } from '@shared-helpers';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-accep-invite',
  templateUrl: './accept-invite.component.html',
  styleUrls: ['./accept-invite.component.scss']
})
export class AcceptInviteComponent implements OnDestroy {
  public user = new InviteUser();
  public response: InvitationRespone;
  public form: FormGroup;
  public documents: OnboardingSteps[] = [];
  private invitationToken: string;
  private destroy$ = new Subject();

  constructor(
    private currentUser: CurrentUserService,
    private router: Router,
    private route: ActivatedRoute,
    private notifier: NotifierService,
  ) {
    this.route.params.pipe(
      switchMap((params: Params) => {
        this.invitationToken = params.token;
        return this.currentUser.loadDocuments(this.invitationToken);
      }),
      takeUntil(this.destroy$)
    ).subscribe((invitation: InvitationRespone) => {
      this.response = invitation;
      this.documents =
        invitation.onboarding.onboardingSteps.filter(step => step.kind !== 'integration');
      this.initForm();
    }, (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.router.navigate(['not-found']);
        }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private getDocumentsGroup(document: OnboardingSteps): FormGroup {
    return new FormGroup({
      id: new FormControl(document.id, []),
      name: new FormControl(document.name, []),
      link: new FormControl(document.link, []),
      read: new FormControl(document.read, [Validators.requiredTrue])
    });
  }

  private createDocumentsGroup(documents: OnboardingSteps[]): FormGroup[] {
    return documents.length && documents.map(document => this.getDocumentsGroup(document)) || [];
  }

  private validateMatchPassword(formGroup: FormGroup): { [key: string]: boolean } {
    const { value: password } = formGroup.get('password');
    const { value: confirmate } = formGroup.get('confirmate');
    return password === confirmate ? null : { passwordNotMatch: true };
  }

  private initForm(): void {
    this.form = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmate: new FormControl(null, [Validators.required]),
      documents: new FormArray(this.createDocumentsGroup(this.documents), []),
    }, { validators: this.validateMatchPassword.bind(this) });
  }

  get documentsBlock(): FormArray {
    return this.form.get('documents') as FormArray;
  }

  get passwordReplayError(): string {
    return (this.form.get('confirmate').touched || this.form.get('confirmate').dirty)
      && this.form.errors?.passwordNotMatch ? this.textError('passwordNotMatch') : '';
  }

  get isValidPassword(): boolean {
    return this.form.get('password').dirty && this.form.get('confirmate').dirty
      && !this.hasError('password') && !this.hasError('confirmate') && !this.passwordReplayError;
  }

  public acceptInvitation(): void {
    this.user.password = this.form.value.password;
    this.user.onboardingAttributes = new ProcessedOnboarding({ id: this.response.onboarding.id });
    this.user.onboardingAttributes.onboardingStepsAttributes =
      this.form.value.documents.map((step: OnboardingSteps) => new OnboardingSteps(step));

    const integrations: string[] =
      this.response.onboarding.onboardingSteps
        .filter(step => step.kind === 'integration')
        .map(step => step.name);

    this.currentUser.acceptInvite(this.invitationToken, this.user)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          if (integrations.length) {
            localStorage.setItem('invitationIntegrations', JSON.stringify(integrations));
          }
          this.router.navigate([`/integrations`]);
        },
        (error) => this.notifier.notify('error', validationMessage(error))
      );
  }

  public textError(controlName: string): string {
    const formedControl = controlName[0].toUpperCase() + controlName.slice(1);

    if (controlName === 'passwordNotMatch') {
      return 'Password didn\'t match';
    }
    if (this.form.get(controlName).errors.minlength) {
      return `Password must be longer than ${this.form.get('password').errors.minlength.requiredLength} characters`;
    }
    if (this.form.get(controlName).errors.required) {
      return `${formedControl} is required.`;
    }
  }

  public hasError(controlName: string): boolean {
    return ((this.form.get(controlName).invalid &&
      (this.form.get(controlName).touched || this.form.get(controlName).dirty))
    );
  }
}
