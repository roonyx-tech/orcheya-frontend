import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Skill, UserSkill } from '../../models';
import { ENGLISH_LEVELS_AMOUNT } from '@consts';

@Component({
  selector: 'app-skills-bubble',
  templateUrl: './skills-bubble.component.html',
  styleUrls: ['./skills-bubble.component.scss']
})
export class SkillsBubbleComponent implements OnInit {
  @Input() public userEnglish: number;

  @Input() public userSkills: Array<UserSkill>;
  @Input() public filter: Array<string>;
  @Input() public skills: Array<Skill>;
  @Output() closeBubble: EventEmitter<void> = new EventEmitter();

  public englishLevelsAmount: number = ENGLISH_LEVELS_AMOUNT;

  constructor() { }

  ngOnInit() {
    if (this.userSkills) {
      this.integrateSkills();
    }
  }

  public integrateSkills(): void {
    this.userSkills.map(userSkill =>
      userSkill.skill = this.skills.find(skill =>
        skill.id === userSkill.skillId
      )
    );
  }

  public getLevels(skillValue: number): Array<number> {
    return [...Array(skillValue).keys()].reverse();
  }

  public checkLevel(currentLevel: number, level: number): boolean {
    return currentLevel >= (level + 1);
  }

  public sortSkills(): void {
    this.userSkills.sort((a, b) => b.level - a.level);
  }

  public close(): void {
    this.closeBubble.emit();
  }
}
