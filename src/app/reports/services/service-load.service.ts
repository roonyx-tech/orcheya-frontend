import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Dash,
  ProjectsTableRow,
  UsersTableRow
} from '../models';
import { Model } from 'tsmodels';
import { User } from '@models';

export interface ServiceLoadResponse {
  dash: Dash;
  datesData: string[];
  loadTable: { percent: number, plan: number, real: number }[];
  usersTable: UsersTableRow[];
  projectsTable: ProjectsTableRow[];
  step: string;
}

const URL = '/api/';

@Injectable()
export class ServiceLoadService {

  constructor(private http: HttpClient) {}

  public getServiceLoad(startDate: string, endDate: string, step: string)
  : Observable<ServiceLoadResponse> {
    return this.http.get(`${ URL }/reports/service_load`, {
      params: new HttpParams()
        .set('start_date', startDate)
        .set('step', step)
        .set('end_date', endDate)
      }).pipe(
        map((data: any) => {
          const dash = Model.new(Dash, data.dash);
          const usersTable = Model.newCollection(
            UsersTableRow, data.users_table
          );
          const datesData = data.dates;
          const loadTable = data.load_table;
          const projectsTable = Model.newCollection(ProjectsTableRow, data.projects_table);
          return { dash, datesData, loadTable, usersTable, projectsTable, step };
        })
      );
  }

  public bestUsers(): Observable<Array<User>> {
    return this.http.get(`${ URL }dashboards`).pipe(map((res: { users: Array<User> }) => Model.newCollection(User, res.users)));
  }
}
