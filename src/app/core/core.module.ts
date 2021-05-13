import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AutosizeModule } from 'ngx-autosize';
import { FullCalendarModule } from '@fullcalendar/angular';

import { CoreRoutingModule } from './core-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReportsModule } from '../reports/reports.module';
import { CoreComponent } from './core.component';

import {
  UserSettingsComponent,
  UserActivityComponent,
  UserTimelineComponent,
  HeaderComponent,
  SlackButtonComponent,
  DiscordButtonComponent,
  TimedoctorButtonComponent,
  TimeActivityComponent,
  UserSettingFormComponent,
  TimeTableComponent,
  RecentUpdateComponent,
  WaitingComponent,
  UserLinksComponent,
  FooterComponent,
  ProjectSelectComponent,
  NotificationsComponent,
  EventModalComponent,
  SkillsComponent,
  SkillCommentsComponent,
  SkillCommentCreateComponent,
  UserSkillsComponent,
  CurrentUserSkillsComponent,
  SkillOfferComponent,
  SkillsBubbleComponent,
  UserListComponent,
  ProjectEditComponent,
  UserBoxBadgeComponent,
  UpdateStatisticsComponent,
} from './components';

import {
  RegistrationGuard,
  PermissionGuard,
  UsersListService,
  UpdateService,
  IntegrationsService,
  FaqService,
  ProjectService,
  NotificationsService,
  UserLinksService,
  NewUpdateService,
  EventService,
  ScrollService,
  SkillsService,
  DifficultyLevelService,
  CurrentUserService,
  CurrentUserGuard,
  JWTTokenInterceptor,
  RolesService,
  PlansService,
  UserWorktimeService,
} from './services';

import {
  AcceptInviteComponent,
  IntegrationsComponent,
  FaqSectionsComponent,
  FaqSectionComponent,
  RegistrationComponent,
  ResetPasswordComponent,
  SetPasswordComponent,
  SignInComponent,
  UpdatesComponent,
  UserProfileComponent,
  UsersListComponent,
  NewUpdateComponent,
  CalendarComponent,
  ErrorComponent,
  DashboardComponent
} from './pages';

import { ImageUploadDirective } from './directives/image-upload.directive';
import { LoadingComponent } from '../shared/loader/loading.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PermissionsGuard } from '@admin-services';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    HttpClientModule,
    FullCalendarModule,
    CoreRoutingModule,
    SharedModule,
    ReportsModule,
    AutosizeModule,
    HighchartsChartModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [
    PermissionsGuard,
    CurrentUserService,
    CurrentUserGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTTokenInterceptor,
      multi: true,
    },
    RegistrationGuard,
    PermissionGuard,
    UsersListService,
    IntegrationsService,
    FaqService,
    UpdateService,
    ProjectService,
    RolesService,
    NotificationsService,
    UserLinksService,
    NewUpdateService,
    EventService,
    NewUpdateService,
    ScrollService,
    SkillsService,
    DifficultyLevelService,
    PlansService,
    UserWorktimeService,
  ],
  declarations: [
    HeaderComponent,
    CoreComponent,
    UserProfileComponent,
    UserSettingsComponent,
    UserActivityComponent,
    UserTimelineComponent,
    UsersListComponent,
    SlackButtonComponent,
    DiscordButtonComponent,
    TimedoctorButtonComponent,
    ImageUploadDirective,
    TimeActivityComponent,
    TimeTableComponent,
    RecentUpdateComponent,
    UserSettingFormComponent,
    FooterComponent,
    WaitingComponent,
    NotificationsComponent,
    UserLinksComponent,
    ProjectSelectComponent,
    EventModalComponent,
    SkillsComponent,
    SkillCommentsComponent,
    SkillCommentCreateComponent,
    CurrentUserSkillsComponent,
    UserSkillsComponent,
    SkillOfferComponent,
    SkillsBubbleComponent,
    UserListComponent,
    ResetPasswordComponent,
    SetPasswordComponent,
    SignInComponent,
    AcceptInviteComponent,
    RegistrationComponent,
    UpdatesComponent,
    IntegrationsComponent,
    NewUpdateComponent,
    CalendarComponent,
    ProjectEditComponent,
    UserBoxBadgeComponent,
    ErrorComponent,
    FaqSectionsComponent,
    FaqSectionComponent,
    UpdateStatisticsComponent,
    DashboardComponent,
  ],
  entryComponents: [
    WaitingComponent,
    EventModalComponent,
    WaitingComponent,
    LoadingComponent,
    SkillCommentCreateComponent,
    ProjectEditComponent,
  ]
})
export class CoreModule {}
