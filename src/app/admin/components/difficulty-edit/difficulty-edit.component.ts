import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import {
  DifficultyLevelService
} from '../../services/difficulty-level.service';

import { DifficultyLevel } from '../../../core/models';

@Component({
  selector: 'app-difficulty-edit',
  templateUrl: './difficulty-edit.component.html',
  styleUrls: ['./difficulty-edit.component.scss']
})
export class DifficultyEditComponent implements OnInit {
  public difficulty: DifficultyLevel;
  public type: string;
  public onDifficultyUpdate: EventEmitter<DifficultyLevel> = new EventEmitter();
  public form: FormGroup;
  private resErrors = {};

  constructor(private difficultyService: DifficultyLevelService,
              public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.initForm();
  }

  public initForm(): void {
    this.form = new FormGroup({
      title: new FormControl(this.difficulty.title, [Validators.required]),
      value: new FormControl(this.difficulty.value, [
        Validators.required,
        Validators.min(1),
        Validators.max(9)
      ])
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const difficulty = new DifficultyLevel();
      Object.assign(difficulty, this.form.value);
      if (this.type === 'new') {
        this.createDifficulty(difficulty);
      } else {
        this.updateDifficulty(difficulty);
      }
    }
  }

  public createDifficulty(difficulty: DifficultyLevel): void {
    this.difficultyService.createDifficulty(difficulty)
      .subscribe(res => this.onDifficultyUpdate.emit(res));
  }

  public updateDifficulty(difficulty: DifficultyLevel): void {
    difficulty.id = this.difficulty.id;
    this.difficultyService.updateDifficulty(difficulty)
      .subscribe(res => this.onDifficultyUpdate.emit(res));
  }

  public close(): void {
    this.bsModalRef.hide();
  }

  public textError(controlName: string): string {
    if (!this.hasError(controlName)) {
      return '';
    }
    if (this.resErrors[controlName]) {
      return this.resErrors[controlName];
    }
    if (this.form.get(controlName).errors) {
      if (this.form.get(controlName).errors.required) {
        return `${controlName} is required`;
      } else if (this.form.get(controlName).errors.min ||
                 this.form.get(controlName).errors.max) {
        return 'The value has to be in interval 1-9';
      }
    }
  }

  public hasError(controlName: string): boolean {
    return (
      (this.form.get(controlName).dirty
        && this.form.get(controlName).invalid
      ) || this.resErrors[controlName]
    );
  }
}
