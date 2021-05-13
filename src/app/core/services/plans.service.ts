import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';

const API_PATH = '/api/plans';
const API_PEOPLE_PATH = API_PATH + '/people';
const API_MANAGERS_PATH = API_PATH + '/managers';
const API_PROJECTS_PATH = API_PATH + '/projects';

export interface PlanResource {
  id: string;
  title: string;
  resourceId?: string;
  children?: PlanResource[];
}

@Injectable()
export class PlansService {
  constructor(private http: HttpClient) {}

  public managers(): Observable<User[]> {
    return this.http.get<User[]>(API_MANAGERS_PATH);
  }
  public projects(): Observable<PlanResource[]> {
    return this.http.get<PlanResource[]>(API_PROJECTS_PATH);
  }
}
