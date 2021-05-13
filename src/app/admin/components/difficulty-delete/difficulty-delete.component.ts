import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import {
  DifficultyLevelService
} from '../../services/difficulty-level.service';

import { DifficultyLevel } from '../../../core/models';

@Component({
  selector: 'app-difficulty-delete',
  templateUrl: './difficulty-delete.component.html',
  styleUrls: ['./difficulty-delete.component.scss']
})
export class DifficultyDeleteComponent {
  public difficulty: DifficultyLevel;
  public error: string;
  public onSkillDelete: EventEmitter<boolean> = new EventEmitter();

  constructor(public bsModalRef: BsModalRef,
              private difficultyService: DifficultyLevelService) { }

  public delete(): void {
    this.difficultyService.deleteDifficulty(this.difficulty.id)
      .subscribe(res => {
        if (res === 204) {
          this.onSkillDelete.emit(true);
        } else {
          this.error = `Difficulty level can't be removed. Some skills use it.`;
        }
      });
  }

  public close(): void {
    this.bsModalRef.hide();
  }
}
