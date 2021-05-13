import { Component, Input, AfterContentChecked } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CurrentUserService, SkillsService } from '../../../services';
import { Skill, SkillUpdate, User, DifficultyLevel, UserSkill } from '../../../models';

import {
  SkillCommentCreateComponent
} from '../../skill-comment-create/skill-comment-create.component';
import { ENGLISH_LEVELS_AMOUNT } from '../../../../constants';
import { UsersListService } from '../../../services';

@Component({
  selector: 'app-user-skills',
  templateUrl: './user-skills.component.html',
  styleUrls: [
    '../skills.component.scss',
    './user-skills.component.scss'
  ]
})
export class UserSkillsComponent implements AfterContentChecked {

  @Input() public userSkills: Array<UserSkill>;
  @Input() public difficultyLevels: Array<DifficultyLevel>;
  @Input() public user: User;

  public toggleComment: number;
  public englishLevel: number;
  public skillGroups: {[key: string]: Array<UserSkill>} = {};

  constructor(
    private skillsService: SkillsService,
    private modalService: BsModalService,
    private currentUserService: CurrentUserService,
    private userService: UsersListService
  ) { }

  ngAfterContentChecked() {
    this.sortSkills();
  }

  public groupBySkillType(userSkills: Array<UserSkill>): {[key: string]: Array<UserSkill>} {
    return userSkills.reduce((result, currentValue) => {
      (result[currentValue.skill.skillType ? currentValue.skill.skillType.title : 'No type'] =
        result[currentValue.skill.skillType ? currentValue.skill.skillType.title : 'No type'] || []).push(currentValue);
      return result;
    }, {});
  }

  public disapprove(userSkillId: number, update: SkillUpdate): void {
    const modal = this.modalService.show(SkillCommentCreateComponent);
    modal.content.onCommentEdit.subscribe(comment => {
      update.comment = comment;
      update.approved = false;
      update.approverId = this.currentUserService.id;
      this.updateSkill(userSkillId, update);
      modal.hide();
    });
  }

  public approve(userSkillId: number, update: SkillUpdate): void {
    update.approved = true;
    update.approverId = this.currentUserService.id;
    this.updateSkill(userSkillId, update);
  }

  public updateSkill(userSkillId: number, update: SkillUpdate): void {
    this.skillsService.updateSkill(this.user.id, update)
      .subscribe(res => {
        const index =
          this.userSkills.findIndex(skill => skill.id === userSkillId);
        this.userSkills[index] = res;
        this.skillGroups = this.groupBySkillType(this.userSkills);
      });
  }

  public sortSkills(): void {
    this.userSkills.sort((a, b) => b.level - a.level);
    this.skillGroups = this.groupBySkillType(this.userSkills);
  }

  public showComment(id: number): void {
    this.toggleComment = id;
  }

  public getLevels(skill: Skill): number[] {
    const difficulty =
      this.difficultyLevels.find(item =>
        item.id === skill.difficultyLevelId
      );
    return Array.from(Array(difficulty.value).keys()).reverse();
  }

  public checkLevel(currentLevel: number, level: number): boolean {
    return currentLevel >= (level + 1);
  }

  public isUpdate(update: any): boolean {
    return update.approved === false;
  }

  public isDisapproved(update: SkillUpdate, level: number): boolean {
    return !update[0].approved &&
            this.checkLevel(update[0].level, level);
  }

  public isExpected(update: SkillUpdate, level: number): boolean {
    return update[0].approved === null &&
           this.checkLevel(update[0].level, level);
  }

  public isApproved(userSkill: UserSkill, level: number): boolean {
    return this.checkLevel(userSkill.level, level);
  }

  public canOperate(): boolean {
    return this.currentUserService.hasPermissions('admin:skills');
  }

  public get englishLevelsAmount(): Array<number> {
    return Array.from(Array(ENGLISH_LEVELS_AMOUNT).keys()).reverse();
  }

  public getLanguageLevelTooltip(level: number): string {
    if (level === 0) {
      return 'beginner';
    }
    if (level === 1) {
      return 'elementary';
    }
    if (level === 2) {
      return 'pre-intermediate';
    }
    if (level === 3) {
      return 'intermediate';
    }
    if (level === 4) {
      return 'upper intermediate';
    }
    if (level === 5) {
      return 'advanced';
    }
    return 'proficiency';
  }

  public getTechLevelTooltip(level: number): string {
    if (level <= 1) {
      return 'junior';
    }
    if (level <= 2 ) {
      return 'pre-middle';
    }
    if (level <= 4) {
      return 'middle';
    }
    if (level <= 5) {
      return 'pre-senior';
    }
    if (level <= 6) {
      return 'senior';
    }
    return 'techlead';
  }

  public updateEnglishLevel(level: number): void {
    this.user.englishLevel = level;
    this.userService
      .updateUserEnglishLevel(this.user)
      .subscribe(user => this.user = user);
  }

  public canUpdateLanguageLevel(): boolean {
    return this.currentUserService.hasPermissions('admin:english_level');
  }

  public trackByGroupFn(index: number, group: {[key: string]: Array<UserSkill>}): number {
    return index;
  }

  public trackBySkillFn(index: number, userSkill: UserSkill): number {
    return index;
  }
}
