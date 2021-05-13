import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SkillsService, DifficultyLevelService } from '../../services';
import { Skill, User, UserSkill, DifficultyLevel } from '../../models';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  @Input() public isCurrUser: boolean;
  @Input() public user: User;

  public allSkills: Array<Skill>;
  public userSkills: Array<UserSkill>;
  public difficultyLevels: Array<DifficultyLevel>;
  public searchSkill = new FormGroup({
    skillName: new FormControl()
  });
  public legend = [
    { style: 'level empty', title: 'empty' },
    { style: 'level current', title: 'current' },
    { style: 'level expected', title: 'expected' },
    { style: 'level disapproved', title: 'disapproved' }
  ];

  constructor(
    private skillsService: SkillsService,
    private difficultyService: DifficultyLevelService
  ) { }

  ngOnInit() {
    this.getUserSkills();
    this.getAllSkills();
    this.getDiffLevels();
    this.searchSkill.get('skillName').valueChanges
      .subscribe(value => this.search(value));
  }

  public getUserSkills(): void {
    this.skillsService.getUserSkills(this.user.id)
      .subscribe(data => this.userSkills = data);
  }

  public getAllSkills(): void {
    this.skillsService.getAllSkills()
      .subscribe(data => this.allSkills = data);
  }

  public getDiffLevels(): void {
    this.difficultyService.getDifficltyLevels()
      .subscribe(data => this.difficultyLevels = data);
  }

  public search(value: string): void {
    if (value === '') {
      this.userSkills = this.skillsService.userSkills;
      this.allSkills = this.skillsService.allSkills;
    } else {
      this.userSkills = this.skillsService.userSkills.filter(
        userSkill => this.compareNames(value, userSkill.skill)
      );
      this.allSkills = this.skillsService.allSkills.filter(
        skill => this.compareNames(value, skill)
      );
    }
  }

  public compareNames(value: string, skill: Skill): boolean {
    value = value.trim();
    let isVariants = false;
    if (skill.variants) {
      isVariants = !!skill.variants.split(',').find(item =>
        !item.trim().toLowerCase().indexOf(value.toLowerCase())
      );
    }
    return !skill.title.toLowerCase().trim().indexOf(value.toLowerCase()) ||
            isVariants;
  }

  public isEmptySkills(): boolean {
    return this.userSkills && this.allSkills &&
           !(this.userSkills.length || this.allSkills.length);
  }
}
