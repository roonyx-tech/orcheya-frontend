import {
  Component,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Section, Question, Answer } from '@models';
import { FaqService } from '@admin-services';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-section-edit',
  templateUrl: './section-edit.component.html',
  styleUrls: ['./section-edit.component.scss']
})
export class SectionEditComponent implements OnInit, OnDestroy {
  public section: Section;
  private type: string;
  public form: FormGroup;
  public onSectionUpdate: EventEmitter<Section> = new EventEmitter();
  private resErrors = {};
  private dataImg: File;
  private destroy$ = new Subject();

  constructor(private faqService: FaqService,
              private formBuilder: FormBuilder,
              public modalRef: BsModalRef) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: this.section && this.section.id,
      title: [this.section && this.section.title, [Validators.required]],
      image: [],
      questions: this.section && this.section.questions
    });
    const questionsFormGroups = (this.section && this.section.questions || []).map(question =>
      this.formBuilder.group({
        id: question.id,
        title: [question.title, [Validators.required, Validators.maxLength(300)]],
        answer: this.formBuilder.group({
          content: [question.answer && question.answer.content, [Validators.required, Validators.maxLength(3000)]]
        })
      }));
    const questionFormArray = this.formBuilder.array(questionsFormGroups);
    this.form.setControl('questions', questionFormArray);
  }

  public addQuestion(): void {
    const blankQuestion = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(300)]),
      answer: new FormGroup({
        content: new FormControl('', [Validators.required, Validators.maxLength(3000)])
      })
    });
    this.questionsFormArray.push(blankQuestion);
  }

  public removeQuestion(id: number): void {
    this.questionsFormArray.removeAt(id);
  }

  get questionsFormArray(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  public handleFileInput(files: File[]): void {
    this.dataImg = files[0];
  }

  public saveData(): void {
    const { ...section } = this.form.value;
    const tempSection = new Section(section);
    tempSection.questionsAttributes = section.questions.map((l, index) => {
      const q = new Question(l);
      q.answerAttributes = new Answer(q.answer);
      return q;
    });
    let removedQuestions: Question[] = [];
    if ((this.section.questions || []).length > (tempSection.questions || []).length) {
      removedQuestions =
        this.section.questions.filter(question => !tempSection.questions.map(q => q.id).includes(question.id));
    }
    removedQuestions.forEach(rq => {
      const q = new Question(rq);
      q.isDestroy = '1';
      q.answerAttributes = new Answer(rq.answer);
      tempSection.questionsAttributes.push(q);
    });

    let func = 'editSection';
    if (this.type === 'new') { func = 'addSection'; }

    this.formFile(this.dataImg)
      .pipe(
        switchMap((base64: string) => {
          tempSection.image = base64 || this.section.image;
          return this.faqService[func](tempSection);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (sectionResp: Section) => {
          this.onSectionUpdate.emit(sectionResp);
        },
        (err: HttpErrorResponse) => {
          if (!err.error.status && !err.error.exception) {
            this.resErrors = err.error;
          }
        }
      );
  }

  private formFile(file: File): Observable<string | ArrayBuffer | boolean> {
    return new Observable((observer) => {
      if (!file) {
        observer.next(false);
      } else {
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          observer.next(reader.result);
        };
        reader.onerror = (error) => observer.error(error);
        reader.onabort = (error) => observer.error(error);
      }
    });
  }

  public textError(formGroup: FormGroup, controlName: string, name: string = null): string {
    const currentName = name || controlName;
    const {errors} = formGroup.get(controlName);
    if (!this.hasError(formGroup, controlName)) { return ''; }
    if (this.resErrors[controlName]) { return this.resErrors[controlName]; }
    if (errors) {
      if (errors.required) {
        return `${currentName} is required`;
      } else if (errors.pattern) {
        return `${currentName} can't be empty`;
      } else if (errors.maxlength) {
        return `${currentName} can't be more than ${errors.maxlength.requiredLength} chars`;
      }
    }
  }

  public hasError(formGroup: FormGroup, controlName: string): boolean {
    return ((formGroup.get(controlName).invalid &&
      (formGroup.get(controlName).touched || formGroup.get(controlName).dirty))
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
