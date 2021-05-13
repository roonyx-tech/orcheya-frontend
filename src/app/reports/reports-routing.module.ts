import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import {
  TimesheetComponent,
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      { path: 'timesheet', component: TimesheetComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
