import { Component, Input, AfterContentChecked, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SkillsService, CurrentUserService, UsersListService } from '../../../services';

import { Skill, SkillUpdate, User, UserSkill, DifficultyLevel } from '../../../models';
import { ENGLISH_LEVELS_AMOUNT } from '../../../../constants';

@Component({
  selector: 'app-current-user-skills',
  templateUrl: './current-user-skills.component.html',
  styleUrls: [
    '../skills.component.scss',
    './current-user-skills.component.scss'
  ]
})
export class CurrentUserSkillsComponent implements OnInit, AfterContentChecked {

  @Input() public userSkills: Array<UserSkill>;
  @Input() public allSkills: Array<Skill>;
  @Input() public difficultyLevels: Array<DifficultyLevel>;
  @Input() public user: User;

  public toggleComment: number;
  public filterSkills: Array<any>;
  public filteredSkillGroups: {[key: string]: Array<UserSkill | Skill>} = {};
  public skillGroups: {[key: string]: Array<UserSkill | Skill>} = {};

  constructor(
    private skillsService: SkillsService,
    private currentUserService: CurrentUserService,
    private userService: UsersListService
  ) { }

  ngOnInit() {
    this.skillGroups = this.groupBySkillType(this.userSkills);
  }

  ngAfterContentChecked() {
    this.toFilterSkills();
  }

  private formGroupName(value: UserSkill | Skill): string {
    return value instanceof UserSkill ?
      value.skill && value.skill.skillType && value.skill.skillType.title || 'No type' :
      value.skillType && value.skillType.title || 'No type';
  }

  public groupBySkillType(userSkills: Array<UserSkill | Skill>): {[key: string]: Array<UserSkill | Skill>} {
    return userSkills.reduce((result, currentValue) => {
      (result[this.formGroupName(currentValue)] =
        result[this.formGroupName(currentValue)] || []).push(currentValue);
      return result;
    }, {});
  }

  public updateSkills(form: NgForm): void {
    const changeSkill = {
      skill_updates: []
    };
    this.allSkills.forEach(skill => {
      const value =
        form.controls[`skill_${skill.id}`] &&
        form.controls[`skill_${skill.id}`].value;
      if (value) {
        const update = new SkillUpdate({
          skill_id: skill.id,
          level: value
        });
        changeSkill.skill_updates.push(update._toJSON());
      }
    });
    if (changeSkill.skill_updates.length) {
      this.skillsService.addUserSkillUpdate(changeSkill, this.user.id)
        .subscribe(res => {
          this.userSkills = res;
          this.skillGroups = this.groupBySkillType(this.userSkills);
          this.toFilterSkills();
        });
    }
    form.reset();
  }

  public removeSkill(userSkillId: number): void {
    this.skillsService.deleteUserSkill(userSkillId, this.user.id)
      .subscribe(res => {
        this.userSkills = res;
        this.skillGroups = this.groupBySkillType(this.userSkills);
        this.toFilterSkills();
      });
  }

  public toFilterSkills() {
    this.filterSkills = this.allSkills.filter(
      skill => !this.userSkills.find(item => item.skill.id === skill.id)
    );
    this.filteredSkillGroups = this.groupBySkillType(this.filterSkills);
  }

  public showComment(id: number): void {
    this.toggleComment = id;
  }

  public getLevels(skill: Skill): Array<number> {
    const difficulty =
      this.difficultyLevels.find(item => item.id === skill.difficultyLevelId);
    return Array.from(Array(difficulty.value).keys()).reverse();
  }

  public checkLevel(currentLevel: number, level: number): boolean {
    return currentLevel >= (level + 1);
  }

  public isUpdate(update: SkillUpdate): boolean {
    return update.approved === false;
  }

  public isDisapproved(update: Array<SkillUpdate>, level: number): boolean {
    return !update[0].approved &&
           this.checkLevel(update[0].level, level);
  }

  public isExpected(update: Array<SkillUpdate>, level: number): boolean {
    return update[0].approved === null &&
           this.checkLevel(update[0].level, level);
  }

  public isApproved(userSkill: UserSkill, level: number): boolean {
    return this.checkLevel(userSkill.level, level);
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

  public get englishLevelsAmount(): Array<number> {
    return Array.from(Array(ENGLISH_LEVELS_AMOUNT).keys()).reverse();
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

  public trackByGroupFn(index: number, group: {[key: string]: Array<UserSkill | Skill>}): number {
    return index;
  }

  public trackBySkillFn(index: number, skill: UserSkill | Skill): number {
    return index;
  }
}
