import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DifficultyLevel } from '../../core/models';

const API_PATH = '/api/difficulty_levels';

@Injectable()
export class DifficultyLevelService {
  constructor(private http: HttpClient) { }

  public getDifficltyLevels(): Observable<Array<DifficultyLevel>> {
    return this.http.get(API_PATH).pipe(
      map((data: any) =>
        DifficultyLevel.newCollection(
          DifficultyLevel, data.difficulty_levels
        )
      )
    );
  }

  public createDifficulty(dif: DifficultyLevel): Observable<DifficultyLevel> {
    return this.http.post(API_PATH, dif._toJSON()).pipe(
      map((data: any) =>
        DifficultyLevel.new(DifficultyLevel, data.difficulty_level)
      )
    );
  }

  public updateDifficulty(difficulty: DifficultyLevel):
    Observable<DifficultyLevel> {
    return this.http
      .put(`${API_PATH}/${difficulty.id}`, difficulty._toJSON())
      .pipe(
        map((data: any) =>
          new DifficultyLevel(data.difficulty_level)
        )
      );
  }

  public deleteDifficulty(id: number): Observable<DifficultyLevel | number> {
    return this.http.delete(`${API_PATH}/${id}`).pipe(
      map((data: any) => {
        if (data.base) {
          return new DifficultyLevel();
        } else {
          return data.status;
        }
      })
    );
  }
}
