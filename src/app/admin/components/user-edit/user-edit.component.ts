import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../services';
import { Role, User, Timing, UserLink } from '@models';
import { ValidateLatin } from '../../../core/validators/latin.validator';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatNumber } from '@shared-helpers';
import { HttpErrorResponse } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { UserLinksService } from '@core-services';
import { SERVICES } from '../../../core/components/user-links/allowed-services';
import { takeUntil } from 'rxjs/operators';
import { ValidateCyrillic } from 'src/app/core/validators/cyrillic.validator';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {

  public userId: number;
  public user: User;
  public roles: Array<Role>;
  public timings: Array<Timing>;
  public form: FormGroup;
  public onUserUpdate: EventEmitter<User> = new EventEmitter();
  public selectedRoles: Array<Role>;
  public typeahead = new Subject<string>();
  public userLinks: FormArray;
  public showLink = false;
  public destroyed = new Subject();
  public kinds: Array<string> = [];
  public saveLinks: Array<UserLink> = [];

  private respErrors;

  constructor(
    public bsModalRef: BsModalRef,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private linksService: UserLinksService,
  ) { }

  ngOnInit() {
    this.usersService
      .edit(this.userId)
      .pipe(takeUntil(this.destroyed))
      .subscribe(x => {
        this.user = x.user;
        this.roles = x.roles;
        this.selectedRoles = x.user.roles;
        this.timings = x.timings;
        this.initializeForm();
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public initializeForm(): void {
    this.form = this.formBuilder.group({
      name: [this.user.name, [Validators.required, ValidateLatin]],
      surname: [this.user.surname, [Validators.required, ValidateLatin]],
      nameCyrillic: [this.user.nameCyrillic, [ValidateCyrillic]],
      birthday: [new Date(this.user.birthday), [Validators.required]],
      employmentAt: [new Date(this.user.employmentAt), [Validators.required]],
      sex: [this.user.sex, []],
      email: [this.user.email, [Validators.required, Validators.email]],
      skype: [this.user.skype, []],
      discordName: [this.user.discordName, []],
      about: [this.user.about, []],
      phone: [this.user.phone, [Validators.required]],
      timingId: [this.user.timingId, [Validators.required]],
      workingHours: [this.user.workingHours, [Validators.required]],
      vacationNotifier: [this.user.vacationNotifier, []],
      newVacationDays: [this.user.newVacationDays, []],
      roles: [this.user.roles, [Validators.required]],
      notifyUpdate: [this.user.notifyUpdate, []],
      userLinks: this.formBuilder.array([]),
    });
    this.formatCurrentUserNumber();
    this.initializeUserLink();
  }

  private formatCurrentUserNumber(): void {
    formatNumber(this.user.phone, this.form.get('phone'));
  }

  private initializeUserLink(): void {
    this.linksService.getUserLinks(this.userId)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
      this.userLinks = this.form.get('userLinks') as FormArray;
      this.linksService.userLinksData.forEach((link: UserLink, index: number) => {
        this.kinds[index] = link.kind;
        this.userLinks.push(this.createLinkFormGroup(link));
      });
      this.saveLinks = this.userLinks.value;
    });
  }

  public hasError(controlName: string): boolean {
    return (
      (this.form.get(controlName).dirty
        && this.form.get(controlName).invalid
      ) || this.respErrors && this.respErrors[controlName]
    );
  }

  public updateSettings(): void {
    if (this.form.invalid) {
      return;
    }

    this.form.value.userLinks
      .filter(linkChange => this.saveLinks.some(link => linkChange.id === link.id && linkChange.link !== link.link))
      .forEach(link => this.updateUserLinks(link));

    Object.assign(this.user, this.form.value);

    this.usersService
      .update(this.user)
      .pipe(takeUntil(this.destroyed))
      .subscribe(
        user => {
          this.respErrors = {};
          this.onUserUpdate.emit(user);
        },
        (err: HttpErrorResponse) => {
          if (!err.error.status && !err.error.exception) {
            this.respErrors = err.error;
          }
        },
        () => null);
  }

  public onRoleChanged(roles: Array<Role>): void {
    this.user.roles = roles;
  }

  public textError(controlName: string): string {
    if (!this.hasError(controlName)) {
      return '';
    }

    if (this.form.get(controlName).errors) {
      if (this.form.get(controlName).errors.required) {
        return `${controlName} is required`;
      } else if (this.form.get(controlName).errors.email) {
        return `${controlName} is not valid email`;
      } else if (this.form.get(controlName).errors.validLatin) {
        return `${controlName} should contain only latin characters`;
      } else if (ValidateCyrillic(this.form.get(controlName))) {
        return `${controlName} should contain only cyrillic characters`;
      }
    }

    if (this.respErrors && this.respErrors[controlName]) {
      return this.respErrors[controlName];
    }
  }

  private updateUserLinks(link: UserLink): void {
    this.linksService.updateUserLink(link, this.userId)
      .pipe(takeUntil(this.destroyed))
      .subscribe();
  }

  public linkToggle(): void {
    this.showLink = !this.showLink;
  }

  private createLinkFormGroup(userLink: UserLink): FormGroup {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/+@\\w .-]*/?';
    return this.formBuilder.group({
      link: [
        userLink ? userLink.link : '',
        [Validators.pattern(reg), Validators.required],
      ],
      id: userLink ? userLink.id : null,
    });
  }

  public makeIconClassName(kind: string): string {
    return SERVICES[kind] ? `fa-${SERVICES[kind].icon}` : 'fa-link';
  }
}
