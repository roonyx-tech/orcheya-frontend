import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SkillsService } from '../../services';
import { Skill } from '../../../core/models';

@Component({
  selector: 'app-skill-delete',
  templateUrl: './skill-delete.component.html',
  styleUrls: ['./skill-delete.component.scss']
})
export class SkillDeleteComponent {
  public skill: Skill;
  public onSkillDelete: EventEmitter<boolean> = new EventEmitter();

  constructor(public bsModalRef: BsModalRef,
              private skillService: SkillsService) { }

  public delete(): void {
    this.skillService.deleteSkill(this.skill.id)
      .subscribe(() => {
        this.onSkillDelete.emit(true);
      });
  }

  public close(): void {
    this.bsModalRef.hide();
  }
}
