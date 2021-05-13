import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SkillType } from '@models';
import { SkillsService } from '@admin-services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-skill-type-edit',
  templateUrl: './skill-type-edit.component.html'
})
export class SkillTypeEditComponent implements OnInit {
  public skillType: SkillType;
  public onSkillTypeUpdate: EventEmitter<SkillType> = new EventEmitter();
  public type: string;
  public form: FormGroup;
  public submitErrors = {};

  constructor(
    private skillsService: SkillsService,
    public modalRef: BsModalRef,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      title: new FormControl(this.skillType.title, [Validators.required])
    });
  }

  public saveSkillType(): void {
    if (this.form.valid) {
      const skillType = new SkillType(this.skillType);
      Object.assign(skillType, this.form.value);
      this.skillsService[`${this.type}SkillType`](skillType)
        .subscribe(
          (type: SkillType) => this.onSkillTypeUpdate.emit(type),
          (error: HttpErrorResponse) => this.submitErrors = error.error);
    }
  }

  public textError(controlName: string): string {
    if (this.submitErrors[controlName]) {
      return `${controlName} ${this.submitErrors[controlName]}`;
    }
    if (this.form.get(controlName).errors.required) {
      return `${controlName} is required`;
    }
  }

  public hasError(controlName: string): boolean {
    return ((this.form.get(controlName).invalid &&
      (this.form.get(controlName).touched || this.form.get(controlName).dirty) || this.submitErrors[controlName])
    );
  }
}
