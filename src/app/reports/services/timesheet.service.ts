import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimesheetFilter, TimesheetRow } from '../models';
import { Model } from 'tsmodels';
import { map } from 'rxjs/operators';

export interface TimesheetResponse {
  timesheetRows: TimesheetRow[];
}

const URL = '/api/reports/timesheet';

@Injectable()
export class TimesheetService {

  constructor(private http: HttpClient) {}

  getTimesheet(filter: TimesheetFilter): Observable<TimesheetResponse> {
    let params = new HttpParams()
      .set('start_date', filter.dates[0].toDateString())
      .set('end_date', filter.dates[1].toDateString());

    if (filter.users && filter.users.length > 0) {
      params = params.set('users_ids', filter.users
        .map(user => user.id).join(','));
    }

    if (filter.roles && filter.roles.length > 0) {
      params = params.set('roles_ids', filter.roles
        .map(role => role.id).join(','));
    }

    return this.http.get(URL, { params }).pipe(
      map((data: any) => {
        return { timesheetRows: Model.newCollection(TimesheetRow, data) } as TimesheetResponse;
      })
    );
  }

  saveFilter(filter: TimesheetFilter) {
    localStorage.setItem('timesheet_filter', JSON.stringify(filter._toJSON()));
  }

  loadFilter(): TimesheetFilter {
    const filterStr = localStorage.getItem('timesheet_filter');
    const filter = new TimesheetFilter();
    if (filterStr) {
      filter._fromJSON(JSON.parse(filterStr));
    }
    return filter;
  }
}
