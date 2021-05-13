import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Project } from '../../../models';
import { ProjectService } from '../../../services';

@Component({
  selector: 'app-project-select',
  template: `
    <ng-select bindLabel="name"
               placeholder="Select project"
               notFoundText="Project not found"
               [items]="projects"
               class="dark-select"
               [ngModel]="selectedProjects"
               [multiple]="multiple"
               [closeOnSelect]="!multiple"
               [hideSelected]="true"
               [clearable]="multiple"
               (change)="(this.multiple
                 ? onProjectChanged($event)
                 : onOneProjectChanged($event)
               )">
    </ng-select>
  `,
  styleUrls: ['./select-project.component.scss']
})
export class ProjectSelectComponent implements OnInit {
  @Input() public multiple = true;
  @Input() set selectedIds(ids: Array<number>) {
    this.InnerSelectedIds = ids;
    this.updateSelectedProjects();
  }

  @Output() public selectProjects = new EventEmitter<Array<Project>>();
  @Output() public selectProject = new EventEmitter<Project>();

  private InnerSelectedIds: Array<number> = [];
  public projects: Array<Project> = [];
  public selectedProjects: Array<Project> = [];

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.projectService.getProjectsList().subscribe(projectList => {
      this.projects = projectList;
      this.updateSelectedProjects();
    });
  }

  public updateSelectedProjects(): void {
    const projects = new Array<Project>();
    for (const project of this.projects) {
      if (this.InnerSelectedIds.indexOf(project.id) > -1) {
        projects.push(project);
      }
    }
    this.selectedProjects = projects;
    this.cdr.markForCheck();
  }

  public onProjectChanged(projects: Array<Project>): void {
    this.selectProjects.emit(projects);
  }

  public onOneProjectChanged(project: Project): void {
    this.selectProject.emit(project);
  }
}
