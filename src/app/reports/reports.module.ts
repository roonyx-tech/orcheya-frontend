import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { SharedModule } from '../shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import {
  ServiceLoadService,
  TimesheetService,
} from './services';
import {TimesheetComponent} from './pages';
import {
  SanitizePipe,
} from './pipes';
import {
  DateRangeComponent,
  DateStepComponent,
  WorklogProgressbarComponent,
  ChartServiceComponent
} from './components';

@NgModule({
    imports: [
        CommonModule,
        ReportsRoutingModule,
        FormsModule,
        SharedModule,
        HighchartsChartModule,
        NgxChartsModule,
    ],
    providers: [
        ServiceLoadService,
        TimesheetService,
    ],
  exports: [
    ChartServiceComponent,
    DateRangeComponent,
    DateStepComponent
  ],
    declarations: [
        ReportsComponent,
        TimesheetComponent,
        SanitizePipe,
        DateStepComponent,
        DateRangeComponent,
        ChartServiceComponent,
        WorklogProgressbarComponent
    ]
})
export class ReportsModule { }
