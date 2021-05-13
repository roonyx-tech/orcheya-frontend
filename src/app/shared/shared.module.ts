import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { UiSwitchModule } from 'ngx-ui-switch';
import { NgSelectModule } from '@ng-select/ng-select';
import { InViewportModule } from 'ng-in-viewport';

import { SidebarComponent, SidebarService } from './sidebar';
import { InputMaskDirective } from './input-mask/input-mask.directive';
import { FilterPipe } from './pipes/filter.pipe';
import { HumanizeDatePipe } from './pipes/humanizeDate.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { HoursPipe } from './pipes/hours.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { MarkdownModule } from 'ngx-markdown';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AutosizeModule } from 'ngx-autosize';
import { LoadingDirective } from './loader/loading.directive';
import { LoadingComponent } from './loader/loading.component';
import {
  PeriodDatePickerComponent
} from './period-date-picker/period-date-picker.component';
import { HasPermissionsDirective, HasSomePermissionsDirective } from './directives';
import * as moment from 'moment';
import { UserSelectAsyncComponent } from './components';
import { TrackService } from './services/track.service';
import { TrackDirective } from './directives/track.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    UiSwitchModule,
    AutosizeModule,
    InViewportModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    AccordionModule.forRoot(),
    ButtonsModule.forRoot(),
    MarkdownModule.forRoot(),
    TimepickerModule.forRoot(),
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  providers: [
    TrackService,
    SidebarService,
  ],
  declarations: [
    SidebarComponent,
    PeriodDatePickerComponent,
    InputMaskDirective,
    LoadingDirective,
    LoadingComponent,
    FilterPipe,
    HumanizeDatePipe,
    DurationPipe,
    HoursPipe,
    TruncatePipe,
    PeriodDatePickerComponent,
    HasPermissionsDirective,
    HasSomePermissionsDirective,
    UserSelectAsyncComponent,
    TrackDirective,
  ],
  exports: [
    SidebarComponent,
    PeriodDatePickerComponent,
    InputMaskDirective,
    LoadingDirective,
    LoadingComponent,
    BsDropdownModule,
    TabsModule,
    BsDatepickerModule,
    NgSelectModule,
    InViewportModule,
    ModalModule,
    ProgressbarModule,
    AccordionModule,
    UiSwitchModule,
    ButtonsModule,
    FilterPipe,
    HumanizeDatePipe,
    DurationPipe,
    HoursPipe,
    TruncatePipe,
    MarkdownModule,
    TimepickerModule,
    AutosizeModule,
    TooltipModule,
    AlertModule,
    TooltipModule,
    PeriodDatePickerComponent,
    HasPermissionsDirective,
    HasSomePermissionsDirective,
    UserSelectAsyncComponent,
    TrackDirective,
  ]
})
export class SharedModule {
  constructor(localeService: BsLocaleService) {
    // date locales setting
    defineLocale('engb', enGbLocale);
    localeService.use('engb');

    moment.updateLocale(moment.locale(), { week: {
        dow: 1, // First day of week is Monday
        doy: 4  // First week of year must contain 4 January (7 + 1 - 4)
      }});
  }
}
