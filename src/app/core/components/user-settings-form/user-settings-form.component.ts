import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { CurrentUserService } from '../../services';
import { User, Timing, AchievementUser, UpdateFavoriteAchievement } from '../../models';
import { Router } from '@angular/router';
import { ValidateLatin } from '../../validators/latin.validator';
import { formatNumber } from '../../../shared/helpers';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ValidateCyrillic } from '../../validators/cyrillic.validator';

@Component({
  selector: 'app-user-settings-form',
  templateUrl: './user-settings-form.component.html',
  styleUrls: ['./user-settings-form.component.scss']
})
export class UserSettingFormComponent implements OnInit, OnDestroy {

  @Input() public achievements: Array<AchievementUser>;
  @Input() private navigateTo: string[] = [];
  public timings: Timing[];
  public form: FormGroup = null;
  public user: User;
  public showButton: boolean;

  private respErrors;
  private subscription: Subscription;
  private dataImg: File;

  constructor(private currentUser: CurrentUserService,
              private formBuilder: FormBuilder,
              private router: Router) {
    this.user = User.new<User>(User, this.currentUser._toJSON([
      'id', 'name', 'surname', 'birthday', 'sex', 'email', 'favorite_achievement', 'discord_name',
      'name_cyrillic', 'skype', 'phone', 'about', 'timing_id', 'role', 'notify_update']));
    this.currentUser
      .edit()
      .subscribe(x => this.timings = x.timings);
  }

  ngOnInit() {
    this.showButton = !!this.navigateTo.length;
    this.form = this.formBuilder.group({
      name: [this.user.name, [Validators.required, ValidateLatin]],
      surname: [this.user.surname, [Validators.required, ValidateLatin]],
      nameCyrillic: [this.user.nameCyrillic, [ValidateCyrillic]],
      birthday: [new Date(this.user.birthday), [Validators.required]],
      sex: [this.user.sex, []],
      email: [this.user.email, [Validators.required, Validators.email]],
      skype: [this.user.skype, []],
      discordName: [this.user.discordName, []],
      about: [this.user.about, []],
      phone: [this.user.phone, [Validators.required]],
      timingId: [this.user.timingId, [Validators.required]],
      notifyUpdate: [this.user.notifyUpdate, []]
    });
    if (this.user.favoriteAchievement) {
      this.form.addControl('achievement', this.formBuilder.control(this.user.favoriteAchievement.id, Validators.required));
    }
    this.formatCurrentUserNumber();
    if (!this.showButton) {
      this.subscribeChanges();
    }
  }

  ngOnDestroy() {
    if (!this.showButton) {
      this.subscription.unsubscribe();
    }
  }

  public onChange(file: File): void {
    this.dataImg = file[0];
  }

  public generationGradient(achievement: AchievementUser): string {
    if (achievement.kind === 'auto') {
      return `radial-gradient(100% 100% at 0% 0%, ${achievement.color} 0%, ${achievement.secondColor} 40%, ${achievement.thirdColor} 100%)`;
    } else {
      return null;
    }
  }

  private subscribeChanges(): void {
    let oldForm = this.form.value;
    this.subscription =
      this.form
        .valueChanges
        .pipe(
          debounceTime(500)
        )
        .subscribe((changedForm) => {
          if (this.form.valid) {
            Object.keys(changedForm).forEach(key => {
              if (changedForm[key] !== oldForm[key]) {
                if (key === 'sex') {
                  return;
                }
                const savedMessageEl =
                  document.getElementById(key).nextElementSibling;
                this.toggleSavedMessage(savedMessageEl);
                setTimeout(() => {
                  this.toggleSavedMessage(savedMessageEl);
                }, 1000);
              }
            });
            oldForm = changedForm;
            this.updateSettings();
          }
        });
  }

  private toggleSavedMessage(element: Element): void {
    element.classList.toggle('saved-block-active');
  }

  private formatCurrentUserNumber() {
    formatNumber(this.user.phone, this.form.get('phone'));
  }

  public hasError(controlName: string): boolean {
    return (
      (this.form.get(controlName).dirty
        && this.form.get(controlName).invalid
      ) || this.respErrors && this.respErrors[controlName]
    );
  }

  public updateSettings() {
    if (this.form.invalid) {
      return;
    }

    if (this.showButton) {
      this.currentUser.uploadAvatar(this.dataImg).subscribe();
    }

    if (this.user.favoriteAchievement) {
      this.currentUser
      .updateFavoriteAchievement(this.user.id, this.form.value.achievement)
      .pipe(
        switchMap((updateAchievement: UpdateFavoriteAchievement) => {
        this.user.favoriteAchievement = updateAchievement.usersAchievement;
        return this.currentUser.load();
      })).subscribe();
    }

    Object.assign(this.user, this.form.value);

    this.currentUser
      .updateSettings(this.user)
      .subscribe(
        () => this.respErrors = {},
        (err: HttpErrorResponse) => {
          if (!err.error.status && !err.error.exception) {
            this.respErrors = err.error;
          }
        },
        () => {
          if (this.navigateTo.length) {
            this.router.navigate(this.navigateTo);
          }
        });
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

    if (this.respErrors[controlName]) {
      return this.respErrors && this.respErrors[controlName];
    }
  }
}
