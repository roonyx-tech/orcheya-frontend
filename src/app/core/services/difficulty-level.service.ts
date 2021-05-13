import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { DifficultyLevel } from '../models';

const API_PATH = '/api/difficulty_levels';

@Injectable()
export class DifficultyLevelService {
  constructor(private http: HttpClient) { }

  public getDifficltyLevels(): Observable<DifficultyLevel[]> {
    return this.http.get(API_PATH).pipe(
      map((data: any) =>
        DifficultyLevel.newCollection(
          DifficultyLevel, data.difficulty_levels
        )
      )
    );
  }
}
