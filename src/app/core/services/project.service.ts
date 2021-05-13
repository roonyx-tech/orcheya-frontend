import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,  } from 'rxjs';
import { Project } from '../models';
import { Model } from 'tsmodels';
import { map } from 'rxjs/operators';

@Injectable()
export class ProjectService {
  private apiPath = '/api';

  constructor(private http: HttpClient) {}

  public getProjectsList(): Observable<Project[]> {
    return this.http.get(`${this.apiPath}/projects`)
      .pipe(map((res: { projects: Project[] }) => Model.newCollection(Project, res.projects)));
  }

  public updateProject(project: Project): Observable<Project> {
    return this.http.put(`${this.apiPath}/projects/${project.id}`, project._toJSON())
      .pipe(map(response => new Project(response)));
  }

  public createProject(project: Project): Observable<Project> {
    return this.http.post(`${this.apiPath}/projects`, project._toJSON())
      .pipe(map(response => new Project(response)));
  }
}
