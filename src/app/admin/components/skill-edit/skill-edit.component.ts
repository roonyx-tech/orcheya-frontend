import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SkillsService } from '../../services';
import {
  DifficultyLevelService
} from '../../services/difficulty-level.service';
import { Skill, DifficultyLevel, SkillType } from '@models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-skill-edit',
  templateUrl: './skill-edit.component.html',
  styleUrls: ['./skill-edit.component.scss']
})
export class SkillEditComponent implements OnInit {
  public skill: Skill;
  public type: string;
  public form: FormGroup;
  public difficultyLevels: Array<DifficultyLevel>;
  public skillTypes: Observable<SkillType[]>;
  private resErrors = {};
  public onSkillUpdate: EventEmitter<Skill> = new EventEmitter();

  constructor(public bsModalRef: BsModalRef,
              private skillService: SkillsService,
              private difficultyService: DifficultyLevelService) { }

  ngOnInit() {
    this.getDiffLevels();
    this.skillTypes = this.skillService.getSkillTypes();
    this.initForm();
  }

  public getDiffLevels(): void {
    this.difficultyService.getDifficltyLevels()
      .subscribe(res => this.difficultyLevels = res);
  }

  public initForm(): void {
    this.form = new FormGroup({
      title: new FormControl(this.skill.title, [Validators.required]),
      difficultyLevelId: new FormControl(
        this.skill.difficultyLevelId,
        [Validators.required]
      ),
      skillTypeId: new FormControl(this.skill.skillType && this.skill.skillType.id),
      variants: new FormControl(this.skill.variants),
      approved: new FormControl(this.skill.approved)
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const skill = new Skill();
      Object.assign(skill, this.form.value);
      if (this.type === 'new') {
        this.createSkill(skill);
      } else {
        this.updateSkill(skill);
      }
    }
  }

  public createSkill(skill: Skill): void {
    skill.approved = skill.approved === null ? false : skill.approved;
    this.skillService.createSkill(skill)
      .subscribe(res => this.onSkillUpdate.emit(res));
  }

  public updateSkill(skill: Skill): void {
    skill.id = this.skill.id;
    this.skillService.updateSkill(skill)
      .subscribe(res => this.onSkillUpdate.emit(res));
  }

  public close(): void {
    this.bsModalRef.hide();
  }

  public textError(controlName: string): string {
    if (!this.hasError(controlName)) {
      return '';
    }
    if (this.resErrors[controlName]) {
      return this.resErrors[controlName];
    }
    if (this.form.get(controlName).errors) {
      if (this.form.get(controlName).errors.required) {
        return `${controlName} is required`;
      }
    }
  }

  public hasError(controlName: string): boolean {
    return (
      (
        this.form.get(controlName).dirty && this.form.get(controlName).invalid
      ) || this.resErrors[controlName]
    );
  }
}
