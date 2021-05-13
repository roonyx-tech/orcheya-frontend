import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SkillType } from '@models';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SkillTypeEditComponent } from '../skill-type-edit/skill-type-edit.component';
import { SkillTypeDeleteComponent } from '../skill-type-delete/skill-type-delete.component';

@Component({
  selector: 'app-skill-types',
  templateUrl: './skill-types.component.html'
})
export class SkillTypesComponent {
  @Input() public skillTypes: Array<SkillType>;
  @Output() public SkillTypesOutput = new EventEmitter<SkillType[]>();
  @Output() public SkillDeleteOutput = new EventEmitter<{ new: SkillType, deleted: SkillType }>();

  constructor(
    private modalService: BsModalService,
  ) { }

  public addSkillType(): void {
    const initialState = { skillType: new SkillType(), type: 'add' };
    const modal = this.modalService.show(SkillTypeEditComponent, { initialState });

    modal.content.onSkillTypeUpdate.subscribe((type) => {
      this.skillTypes.unshift(type);
      this.SkillTypesOutput.emit(this.skillTypes);
      modal.hide();
    });
  }

  public editSkillType(skillType: SkillType): void {
    const initialState = { skillType, type: 'edit' };
    const modal = this.modalService.show(SkillTypeEditComponent, { initialState });

    modal.content.onSkillTypeUpdate.subscribe((type) => {
      this.skillTypes.splice(this.skillTypes.indexOf(skillType), 1, type);
      this.SkillTypesOutput.emit(this.skillTypes);
      modal.hide();
    });
  }

  public deleteSkillType(skillType: SkillType): void {
    const initialState = { skillType, skillTypes: this.skillTypes };
    const modal = this.modalService.show(SkillTypeDeleteComponent, { initialState });

    modal.content.onSkillTypeDelete.subscribe((res) => {
      this.skillTypes = this.skillTypes.filter(t => t.id !== res.deleted.id);
      this.SkillTypesOutput.emit(this.skillTypes);
      this.SkillDeleteOutput.emit(res);
      modal.hide();
    });
  }

}
