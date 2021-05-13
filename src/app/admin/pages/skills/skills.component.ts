import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SkillsService } from '../../services';
import {
  DifficultyLevelService
} from '../../services/difficulty-level.service';
import { Skill, DifficultyLevel, SkillType } from '@models';
import { SkillEditComponent, SkillDeleteComponent } from '../../components';
import { forkJoin } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsComponent implements OnDestroy {
  public skills: Array<Skill>;
  public difficultyLevels: Array<DifficultyLevel>;
  public skillTypes: Array<SkillType> = [];
  public skillDeleteAction: { new: SkillType, deleted: SkillType };

  constructor(
    private skillsService: SkillsService,
    private modalService: BsModalService,
    private difficultyService: DifficultyLevelService,
    private cdr: ChangeDetectorRef
  ) {
    forkJoin([
      this.skillsService.getAllSkills(),
      this.difficultyService.getDifficltyLevels(),
      this.skillsService.getSkillTypes()
    ])
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        [this.skills, this.difficultyLevels, this.skillTypes] = res;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {}

  public getDifficulty(skill: Skill): string {
    return this.difficultyLevels
      .find(item => skill.difficultyLevelId === item.id).title;
  }

  public getSkillType(skill: Skill): string {
    if (this.skillDeleteAction && this.skillDeleteAction.deleted.id === skill.skillType.id) {
      skill.skillType = this.skillDeleteAction.new;
    }
    return this.skillTypes.find(type => skill.skillType.id === type.id).title;
  }

  public addSkill(): void {
    const initialState = {
      skill: new Skill(),
      type: 'new'
    };
    const modal = this.modalService.show(SkillEditComponent, { initialState });
    modal.content
      .onSkillUpdate
      .subscribe(res => {
        this.skills.unshift(res);
        modal.hide();
        this.cdr.markForCheck();
      });
  }

  public editSkill(skill: Skill): void {
    const initialState = { skill, type: 'edit' };
    const modal = this.modalService.show(SkillEditComponent, { initialState });
    modal.content
      .onSkillUpdate
      .subscribe(res => {
        this.skills.splice(this.skills.indexOf(skill), 1, res);
        modal.hide();
        this.cdr.markForCheck();
      });
  }

  public approve(skill: Skill): void {
    skill.approved = true;
    this.skillsService.updateSkill(skill)
      .subscribe(res => {
        this.skills.splice(this.skills.indexOf(skill), 1, res);
        this.cdr.markForCheck();
      });
  }

  public disapprove(skill: Skill): void {
    this.skillsService.deleteSkill(skill.id)
      .subscribe(() => {
        this.skills = this.skills.filter(item => item.id !== skill.id);
        this.cdr.markForCheck();
      });
  }

  public delete(skill: Skill): void {
    const initialState = { skill };
    const modal =
      this.modalService.show(SkillDeleteComponent, { initialState });
    modal.content
      .onSkillDelete
      .subscribe(res => {
        if (res) {
          this.skills = this.skills.filter(item => item.id !== skill.id);
          modal.hide();
          this.cdr.markForCheck();
        }
      });
  }

  public receiveDifficultyLevels(levels: Array<DifficultyLevel>): void {
    this.difficultyLevels = levels;
  }
}
