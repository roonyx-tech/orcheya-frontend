import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { DifficultyLevel } from '../../../core/models';

import {
  DifficultyEditComponent
} from '../difficulty-edit/difficulty-edit.component';
import {
  DifficultyDeleteComponent
} from '../difficulty-delete/difficulty-delete.component';

@Component({
  selector: 'app-difficulty-levels',
  templateUrl: './difficulty-levels.component.html',
  styleUrls: ['./difficulty-levels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DifficultyLevelsComponent {
  @Input() public difficultyLevels: Array<DifficultyLevel>;
  @Output() public diffLevelsOutput = new EventEmitter<Array<DifficultyLevel>>();

  constructor(
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef
  ) { }

  public addDifficulty(): void {
    const initialState = {
      difficulty: new DifficultyLevel(),
      type: 'new'
    };
    const modal =
      this.modalService.show(DifficultyEditComponent, { initialState });
    modal.content
      .onDifficultyUpdate
      .subscribe(res => {
        this.difficultyLevels.unshift(res);
        this.sortDifficutyLevels();
        this.diffLevelsOutput.emit(this.difficultyLevels);
        modal.hide();
        this.cdr.markForCheck();
      });
  }

  public editDifficulty(difficulty: DifficultyLevel): void {
    const initialState = { difficulty, type: 'edit' };
    const modal =
      this.modalService.show(DifficultyEditComponent, { initialState });
    modal.content
      .onDifficultyUpdate
      .subscribe(res => {
        this.difficultyLevels
          .splice(this.difficultyLevels.indexOf(difficulty), 1, res);
        this.sortDifficutyLevels();
        this.diffLevelsOutput.emit(this.difficultyLevels);
        modal.hide();
        this.cdr.markForCheck();
      });
  }

  public delete(difficulty: DifficultyLevel): void {
    const initialState = { difficulty };
    const modal =
      this.modalService.show(DifficultyDeleteComponent, { initialState });
    modal.content
      .onSkillDelete
      .subscribe(res => {
        if (res) {
          this.difficultyLevels =
            this.difficultyLevels.filter(item => item.id !== difficulty.id);
          modal.hide();
          this.cdr.markForCheck();
        }
      });
  }

  public sortDifficutyLevels() {
    this.difficultyLevels.sort((a, b) => a.value - b.value);
  }
}
