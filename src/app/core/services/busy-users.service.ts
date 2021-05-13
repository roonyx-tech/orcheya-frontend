import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusyResponse } from '@models';
import { map } from 'rxjs/operators';

const BUSY_PATH = 'api/users/busy';

@Injectable({
  providedIn: 'root'
})
export class BusyUsersService {

  constructor(private http: HttpClient) { }

  public request(): Observable<BusyResponse> {
    return this.http.get<BusyResponse>(BUSY_PATH).pipe(
      map((data: any) => new BusyResponse(data))
    );
  }

}
