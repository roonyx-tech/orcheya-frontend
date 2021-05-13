import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PlansService, ProjectService } from '../../services';
import { Project } from '../../models';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})

export class ProjectEditComponent implements OnInit, OnDestroy {
  public project: Project = {} as Project;
  public managers;
  public form: FormGroup;
  public onUpdate: EventEmitter<Project> = new EventEmitter();
  public destroyed = new Subject();

  private respErrors;

  constructor(
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    private plansService: PlansService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.project.name, []],
      title: [this.project.title, []],
      paid: [this.project.title, []],
      archived: [this.project.archived, []],
      managerId: [this.project.managerId, []],
    });
    this.plansService.managers()
      .pipe(takeUntil(this.destroyed))
      .subscribe(managers => this.managers = managers);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public save() {
    if (this.form.invalid) { return; }

    Object.assign(this.project, this.form.value);

    const request = this.project.id ? this.projectService.updateProject(this.project)
                                    : this.projectService.createProject(this.project);
    request.subscribe(
      project => {
        this.respErrors = {};
        this.onUpdate.emit(project);
        this.bsModalRef.hide();
      },
      (err: HttpErrorResponse) => {
        if (!err.error.status && !err.error.exception) {
          this.respErrors = err.error;
        }
      });
  }

  public textError(controlName: string): string {
    if (!this.hasError(controlName)) {
      return '';
    }

    if (this.form.get(controlName).errors) {
      if (this.form.get(controlName).errors.required) {
        return `${controlName} is required`;
      }
    }

    if (this.respErrors && this.respErrors[controlName]) {
      return this.respErrors[controlName];
    }
  }

  public hasError(controlName: string): boolean {
    return (
      (this.form.get(controlName).dirty
        && this.form.get(controlName).invalid
      ) || this.respErrors && this.respErrors[controlName]
    );
  }
}
