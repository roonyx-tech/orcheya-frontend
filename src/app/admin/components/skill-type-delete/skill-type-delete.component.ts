import { Component, OnInit, EventEmitter } from '@angular/core';
import { SkillsService } from '@admin-services';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SkillType } from '@models';

@Component({
  selector: 'app-skill-type-delete',
  templateUrl: './skill-type-delete.component.html'
})
export class SkillTypeDeleteComponent implements OnInit {
  public skillType: SkillType;
  public skillTypes: SkillType[];
  public enabledSkillTypes: SkillType[];
  public newSkillTypeId: number;
  public onSkillTypeDelete = new EventEmitter<{ new: SkillType, deleted: SkillType }>();

  constructor(
    private skillsService: SkillsService,
    public modalRef: BsModalRef,
  ) { }

  ngOnInit() {
    this.enabledSkillTypes = this.skillTypes.filter(type => type !== this.skillType);
  }

  public deleteSkillType(): void {
    const newSkillType =
      this.skillTypes.find(type => type.id === +this.newSkillTypeId);
    this.skillsService.deleteSkillType(this.skillType, newSkillType)
      .subscribe(() => {
        this.onSkillTypeDelete.emit({ deleted: this.skillType, new: newSkillType });
      });
  }
}
