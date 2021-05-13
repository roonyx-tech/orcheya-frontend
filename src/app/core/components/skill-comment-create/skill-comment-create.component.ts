import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-skill-comment-create',
  templateUrl: './skill-comment-create.component.html',
  styleUrls: ['./skill-comment-create.component.scss']
})
export class SkillCommentCreateComponent implements OnInit {
  public comment: string;
  public form: FormGroup;
  private resErrors = {};
  public onCommentEdit: EventEmitter<string> = new EventEmitter();

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.initForm();
  }

  public initForm(): void {
    this.form = new FormGroup({
      comment: new FormControl('', [
        Validators.required,
        Validators.minLength(10)
      ])
    });
  }

  public sendComment(): void {
    if (this.form.valid) {
      this.onCommentEdit.emit(this.comment);
    }
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
      } else if (this.form.get(controlName).errors.minLength) {
        return 'Your comment too short';
      }
    }
  }

  public hasError(controlName: string): boolean {
    return (
      (
        this.form.get(controlName).dirty && this.form.get(controlName).invalid
      ) || this.resErrors[controlName]
    );
  }
}
