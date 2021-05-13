import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject, zip } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { RolesService, UsersService, AchievementsService, AchievementCounters } from '@admin-services';
import { Role, User, Achievement, AchievementLevel } from '@models';
import { validationMessage } from '@shared-helpers';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-achievement-edit',
  templateUrl: './achievement-edit.component.html',
  styleUrls: ['./achievement-edit.component.scss']
})
export class AchievementEditComponent implements OnInit, OnDestroy {
  public achievement: Achievement;
  public type: string;

  public form: FormGroup;
  public isLoading = false;
  public onAchievementUpdate: EventEmitter<Achievement> = new EventEmitter();
  public endpoints$: Observable<AchievementCounters[]> = this.achievementsService.getCounters();
  public roles: Role[];
  public users: User[];
  public kinds = {
    auto: 'auto',
    manual: 'manual',
  };

  private dataImg: File;
  private initialEmptyKind: string;
  private destroy$ = new Subject();
  private rangeValidators = [Validators.required, Validators.pattern('^[0-9]*$')];
  private colorValidators = [Validators.required, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')];
  private deletedLevels: AchievementLevel[] = [];

  constructor(
    public modalRef: BsModalRef,
    private rolesService: RolesService,
    private usersService: UsersService,
    private achievementsService: AchievementsService,
    private notifier: NotifierService,
  ) { }

  ngOnInit() {
    if (this.achievement) {
      this.initialEmptyKind = !!!Object.keys(this.achievement).length
        && this.kinds.auto || this.kinds.manual;
    }

    zip(
      this.usersService.getUsersList(),
      this.rolesService.getRolesList()
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe(([usersIndex, roles]) => {
      this.users = usersIndex.users;
      this.roles = roles;
    });

    this.initForm();
    this.onTypeChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get levelsBlock(): FormArray {
    return this.form.get('levels') as FormArray;
  }

  private getLevelsGroup(level?: AchievementLevel): FormGroup {
    return new FormGroup({
      id: new FormControl(level && level.id, []),
      name: new FormControl(level && level.name, [Validators.required]),
      from: new FormControl(level && level.from, this.rangeValidators),
      to: new FormControl(level && level.to, this.rangeValidators),
      color: new FormControl(level && level.color, this.colorValidators),
      secondColor: new FormControl(level && level.secondColor, this.colorValidators),
      thirdColor: new FormControl(level && level.thirdColor, this.colorValidators),
    });
  }

  private createLevelsGroup(levels: AchievementLevel[]): FormGroup[] {
    let groups: FormGroup[] = [];

    if (levels && levels.length) {
      levels.sort((a, b) => a.number - b.number);
      groups = levels.map(level => this.getLevelsGroup(level));
    } else {

      if (this.initialEmptyKind === this.kinds.auto) {
        groups = [this.getLevelsGroup()];
      }

    }
    return groups;
  }

  public displayDeleteBtn(index: number, length: number): boolean {
    if (this.type === 'add') {
      return index !== 0 || length > 1;
    } else {
      return index !== 0 && length - 1 === index;
    }
  }

  private initForm(): void {
    this.form = new FormGroup({
      image: new FormControl(null, []),
      kind: new FormControl(
        this.achievement && this.achievement.kind || this.kinds.auto,
        [Validators.required]
      ),
      title: new FormControl(
        this.achievement && this.achievement.title,
        [Validators.required]
      ),
      users: new FormControl(
        this.achievement && this.achievement.users && this.achievement.users.map(u => u.id),
        []
      ),
      endpoint: new FormControl(
        this.achievement && this.achievement.endpoint,
        this.isAuto && [Validators.required]
      ),
      roles: new FormControl(
        this.achievement && this.achievement.roles && this.achievement.roles.map(r => r.id),
        this.isAuto && [Validators.required]
      ),
      levels: new FormArray(
        this.createLevelsGroup(this.achievement && this.achievement.levels),
        this.isAuto && [Validators.required]
      ),
    });
  }

  get isAuto(): boolean {
    return this.achievement && this.achievement.kind === this.kinds.auto;
  }

  public submit(): void {
    if (this.form.invalid) { return; }

    const achievement = new Achievement();
    achievement.id = this.achievement && this.achievement.id;
    achievement.title = this.form.value.title;
    achievement.kind = this.form.value.kind;

    if (this.form.value.kind === this.kinds.auto) {
      achievement.endpoint = this.form.value.endpoint;
      achievement.roleIds = this.form.value.roles;
      achievement.levelsAttributes = this.form.value.levels.map((l: AchievementLevel, index: number) => {
        l.number = index + 1;
        return Object.assign(new AchievementLevel(), l);
      });
      achievement.levelsAttributes = [...achievement.levelsAttributes, ...this.deletedLevels];
    } else {
      achievement.userIds = this.form.value.users;
    }
    this.isLoading = true;
    this.formFile(this.dataImg)
      .pipe(
        switchMap((base64: string) => {
          if (base64) {
            achievement.image = base64;
          }
          return this.achievementsService[`${this.type}Achievement`](achievement);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (response: Achievement) => {
          this.onAchievementUpdate.emit(response);
          this.isLoading = false;
        },
        (error) => {
          this.notifier.notify('error', validationMessage(error));
          this.isLoading = false;
        },
      );
  }

  private formFile(file: File): Observable<string | ArrayBuffer> {
    return new Observable((observer) => {
      if (!file) {
        observer.next(null);
      } else {
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          observer.next(reader.result);
        };
        reader.onerror = (error) => observer.error(error);
        reader.onabort = (error) => observer.error(error);
      }
    });
  }

  public addLevelGroup(): void {
    this.levelsBlock.push(this.getLevelsGroup());
  }

  public deleteLevel(index: number, level: AchievementLevel): void {
    if (level.id) {
      const deletedLevel = new AchievementLevel(level);
      deletedLevel.destroy = true;
      this.deletedLevels.push(deletedLevel);
    }
    this.levelsBlock.removeAt(index);
  }

  public handleFileInput(files: File[]): void {
    this.dataImg = files[0];
  }

  public onSelectAll(nameArray: string) {
    const selected = this[nameArray].map(item => item.id);
    this.form.get(nameArray).patchValue(selected);
  }

  private onTypeChanges(): void {
    this.form.get('kind').valueChanges.subscribe((value: string) => {
      switch (value) {
        case this.kinds.manual: {
          this.form.controls.endpoint.clearValidators();
          this.form.controls.roles.clearValidators();
          this.form.controls.levels.clearValidators();

          this.form.controls.endpoint.updateValueAndValidity();
          this.form.controls.roles.updateValueAndValidity();
          this.form.controls.levels.updateValueAndValidity();
          this.form.controls.users.setValidators([Validators.required]);
          this.form.controls.users.updateValueAndValidity();

          this.levelsBlock.controls.forEach((level: FormGroup) => {
            level.controls.name.clearValidators();
            level.controls.from.clearValidators();
            level.controls.to.clearValidators();
            level.controls.color.clearValidators();
            level.controls.secondColor.clearValidators();
            level.controls.thirdColor.clearValidators();

            level.controls.name.updateValueAndValidity();
            level.controls.from.updateValueAndValidity();
            level.controls.to.updateValueAndValidity();
            level.controls.color.updateValueAndValidity();
            level.controls.secondColor.updateValueAndValidity();
            level.controls.thirdColor.updateValueAndValidity();
          });

          break;
        }
        case this.kinds.auto : {
          this.form.controls.endpoint.setValidators([Validators.required]);
          this.form.controls.roles.setValidators([Validators.required]);
          this.form.controls.levels.setValidators([Validators.required]);

          this.form.controls.endpoint.updateValueAndValidity();
          this.form.controls.roles.updateValueAndValidity();
          this.form.controls.levels.updateValueAndValidity();
          this.form.controls.users.clearValidators();
          this.form.controls.users.updateValueAndValidity();

          this.levelsBlock.controls.forEach((level: FormGroup) => {
            level.controls.name.setValidators([Validators.required]);
            level.controls.from.setValidators(this.rangeValidators);
            level.controls.to.setValidators(this.rangeValidators);
            level.controls.color.setValidators(this.colorValidators);
            level.controls.secondColor.setValidators(this.colorValidators);
            level.controls.thirdColor.setValidators(this.colorValidators);

            level.controls.name.updateValueAndValidity();
            level.controls.from.updateValueAndValidity();
            level.controls.to.updateValueAndValidity();
            level.controls.color.updateValueAndValidity();
            level.controls.secondColor.updateValueAndValidity();
            level.controls.thirdColor.updateValueAndValidity();
          });

          break;
        }
      }
    });
  }

  public textError(formGroup: FormGroup, controlName: string): string {
    const formedControl = controlName[0].toUpperCase() + controlName.slice(1);

    if (formGroup.get(controlName).errors.required) {
      return `${formedControl} is required.`;
    }
    if ((controlName === 'color' || 'secondColor' || 'thirdColor') && formGroup.get(controlName).errors.pattern) {
      return `${formedControl} must be Hexadecimal. (e.g. #333)`;
    }
    if (controlName === 'from' || controlName === 'to' && formGroup.get(controlName).errors.pattern) {
      return `"${formedControl}" must be Integer positive.`;
    }
  }

  public hasError(formGroup: FormGroup, controlName: string): boolean {
    return ((formGroup.get(controlName).invalid &&
      (formGroup.get(controlName).touched || formGroup.get(controlName).dirty))
    );
  }
}
