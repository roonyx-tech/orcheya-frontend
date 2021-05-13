import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { switchMap, takeUntil } from 'rxjs/operators';
import {
  Document,
  Groups,
  Invite,
  OnboardingAttributes,
  Role,
  WorkDocument
} from '@models';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RolesService } from '@admin-services';
import { Subject } from 'rxjs';
import { ValidateLatin } from '../../../core/validators/latin.validator';
import { OnboardingService } from '@admin-services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ShowInviteComponent } from '..';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-form-invite',
  templateUrl: './form-invite.component.html',
  styleUrls: ['./form-invite.component.scss']
})
export class FormInviteComponent implements OnDestroy, OnInit {
  @Input() userId: string;
  public addDocument = { name: '', link: '' };
  public roles: Array<Role>;
  public documents: WorkDocument = { default: [], byRole: [], insert: [] };
  public groups: Array<Groups> = [];
  public userInvited: Invite;
  public isLoading = true;
  public form: FormGroup;
  public onBoarding: FormGroup;

  private respErrors: string;
  private destroyed = new Subject();

  constructor(
    private role: RolesService,
    private onBoardingService: OnboardingService,
    private modalService: BsModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.userId) {
      this.initPageCreateInvite();
    } else {
      this.initPageUpdateInvite();
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private initPageCreateInvite(): void {
    this.role.getRolesList()
      .pipe(
        takeUntil(this.destroyed),
        switchMap((roles: Array<Role>) => {
          this.roles = roles;
          return this.onBoardingService.getSteps();
        })).subscribe((steps: Array<Document>) => {
      const tools: Groups = {title: 'Tools Access', checkbox: []};
      const integrations: Groups = {title: 'Integrations', checkbox: []};
      const defaultDocument: Array<Document> = [];
      steps.forEach(step => {
        step.status = true;
        if (step.kind === 'tool') {
          tools.checkbox.push(step);
        } else if (step.kind === 'integration') {
          integrations.checkbox.push(step);
        } else if (step.kind === 'document' && step.default) {
          defaultDocument.push(step);
        }
      });
      this.groups.push(tools, integrations);
      this.documents.default = defaultDocument;
      this.isLoading = false;
      this.initialization();
    });
  }

  private initPageUpdateInvite(): void {
    this.role.getRolesList()
      .pipe(
        takeUntil(this.destroyed),
        switchMap((roles: Array<Role>) => {
          this.roles = roles;
          return this.onBoardingService.userInvite(this.userId);
        })).subscribe((user: Invite) => {
      this.userInvited = user;
      const tools: Groups = {title: 'Tools Access', checkbox: []};
      const integrations: Groups = {title: 'Integrations', checkbox: []};
      const defaultDocument: Array<Document> = [];
      this.userInvited.onboarding.onboardingSteps.forEach(step => {
        step.status = true;
        if (step.kind === 'tool') {
          tools.checkbox.push(step);
        } else if (step.kind === 'integration') {
          integrations.checkbox.push(step);
        } else if (step.kind === 'document') {
          defaultDocument.push(step);
        }
      });
      this.groups.push(tools, integrations);
      this.documents.default = defaultDocument;
      this.isLoading = false;
      this.initialization();
    });
  }

  private initialization(): void {
    this.form = new FormGroup({
      name: new FormControl(
        this.userInvited && this.userInvited.name || '',
        [Validators.required, ValidateLatin]),
      surname: new FormControl(
        this.userInvited && this.userInvited.surname || '',
        [Validators.required, ValidateLatin]),
      sex: new FormControl(
        this.userInvited && (this.userInvited.sex === 'male' ? 1 : 2),
        [Validators.required]),
      role: new FormControl(
        this.userInvited && this.userInvited.roles
        && this.userInvited.roles.map(r => r.id) || null,
        []),
      employmentAt: new FormControl(
        this.userInvited && this.userInvited.employmentAt || new Date(moment.now()),
        [Validators.required]),
      workingHours: new FormControl(
        this.userInvited && this.userInvited.workingHours || '35',
        [Validators.required]),
      email: new FormControl(
        this.userInvited && this.userInvited.email || '',
        [Validators.required, Validators.email]),
      onboardingAttributes: new FormGroup({
        gmailLogin: new FormControl(
          this.userInvited && this.userInvited.onboarding.gmailLogin || '',
          [Validators.required, Validators.email]),
        gmailPassword: new FormControl(
          this.userInvited && this.userInvited.onboarding.gmailPassword || '',
          [Validators.required]),
        stepIds: new FormControl([], []),
        stepsAttributes: new FormArray([], [])
      })
    });
    this.onBoarding = this.form.controls.onboardingAttributes as FormGroup;
  }

  get stepsAttributes(): FormArray {
    return this.onBoarding.get('stepsAttributes') as FormArray;
  }

  public showDocumentRole(role: any): void {
    const roleId = typeof role === 'object' ? role.id : role;
    this.onBoardingService
      .getSteps(roleId)
      .pipe(takeUntil(this.destroyed))
      .subscribe((documents: Array<Document>) => {
        const roleDocument: Array<Document> = [];
        documents.forEach(document => {
          document.status = true;
          roleDocument.push(document);
        });
        this.documents.byRole = roleDocument;
      });
  }

  public showInvite(urlInvite: string): void {
    const initialState = { urlInvite };

    const modal = this.modalService.show(ShowInviteComponent, {initialState});
    modal.content
      .invite
      .pipe(takeUntil(this.destroyed))
      .subscribe();
    this.router.navigate(['/admin/users']);
  }

  public cancelInvite(): void {
    if (confirm(`Do you really want to exit the page?`)) {
      this.router.navigate(['admin/users']);
    }
  }

  public hasError(controlName: string, formGroup: FormGroup = this.form): boolean {
    return (
      (formGroup.get(controlName)?.dirty
        && formGroup.get(controlName).invalid
      ) || this.respErrors && this.respErrors[controlName]
    );
  }

  public textError(controlName: string, formGroup: FormGroup = this.form): string {
    if (!this.hasError(controlName, formGroup)) {
      return '';
    }

    if (formGroup.get(controlName).errors) {
      if (formGroup.get(controlName).errors.required) {
        return `${controlName} is required`;
      } else if (formGroup.get(controlName).errors.email) {
        return `${controlName} is not valid email`;
      } else if (formGroup.get(controlName).errors.validLatin) {
        return `${controlName} should contain only latin characters`;
      }
    }

    if (this.respErrors && this.respErrors[controlName]) {
      return this.respErrors[controlName];
    }
  }

  indexOrderAsc = (akv: KeyValue<string, any>, bkv: KeyValue<string, any>): number => {
    const a = akv.value.index;
    const b = bkv.value.index;

    return a > b ? 1 : (b > a ? -1 : 0);
  }

  public sortDocument(key: string): Array<number> {
    const stepIds = [];

    [].concat(...this.groups.map(group => group.checkbox))
      .forEach(checkbox => {
        if (checkbox.status) {
          stepIds.push(checkbox[key]);
        }
      });

    [].concat(...Object.keys(this.documents).map(docName => this.documents[docName]))
      .filter(checkbox => checkbox.status === true)
      .forEach(document => {
        if (document[key]) {
          stepIds.push(document[key]);
        } else if (key === 'stepId' && (!document[key] && document.id)) {
          stepIds.push(document.id);
        } else {
          this.stepsAttributes.push(new FormControl(document, []));
        }
      });
    return stepIds;
  }

  public workingInvite(): void {
    if (this.form.invalid) {
      return;
    }

    const user = new Invite();
    Object.assign(user, this.form.value);
    user.onboardingAttributes = new OnboardingAttributes();

    if (!this.userId) {
      user.role = [this.form.value.role];
      this.onBoarding.get('stepIds').reset(this.sortDocument('id'));
    } else {
      if (typeof user.role !== 'object') {
        user.role = [this.form.value.role];
      }
      user.onboardingAttributes.id = this.userInvited.onboarding.id;
      this.onBoarding.get('stepIds').reset(this.sortDocument('stepId'));
    }
    Object.assign(user.onboardingAttributes, this.form.value.onboardingAttributes);

    this.onBoardingService
      .invite(user, this.userId)
      .pipe(takeUntil(this.destroyed))
      .subscribe(inviteUrl => this.showInvite(inviteUrl),
        res => {
          this.respErrors = res.error;
        });
  }
}
