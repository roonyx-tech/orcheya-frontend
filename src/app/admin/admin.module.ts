import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';


import { AdminComponent } from './admin.component';
import {
  UsersService,
  RolesService,
  PermissionsService,
  SkillsService,
  FaqService,
  PermissionsGuard,
  OnboardingService,
} from './services';

import {
  UsersComponent,
  RolesComponent,
  SkillsComponent,
  AchievementsComponent,
  EditInviteComponent,
  CreateInviteComponent,
  FaqComponent
} from './pages';

import {
  UserEditComponent,
  RoleEditComponent,
  RoleDeleteComponent,
  UserDeleteComponent,
  SkillTypesComponent,
  SkillTypeEditComponent,
  SkillTypeDeleteComponent,
  SkillEditComponent,
  SkillDeleteComponent,
  DifficultyLevelsComponent,
  DifficultyEditComponent,
  DifficultyDeleteComponent,
  AchievementEditComponent,
  ShowInviteComponent,
  InvitedDeleteComponent,
  SectionEditComponent,
} from './components';

import {
  ConfirmModalWorklogComponent,
} from './modals';

import { DifficultyLevelService } from './services/difficulty-level.service';
import { ClipboardModule } from 'ngx-clipboard';
import { FormInviteComponent } from './components/form-invite/form-invite.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    CarouselModule.forRoot(),
    TypeaheadModule.forRoot(),
    SharedModule,
    AdminRoutingModule,
    ClipboardModule,
  ],
  providers: [
    PermissionsGuard,
    UsersService,
    RolesService,
    PermissionsService,
    SkillsService,
    OnboardingService,
    DifficultyLevelService,
    FaqService,
  ],
  declarations: [
    AdminComponent,
    UsersComponent,
    RolesComponent,
    UserEditComponent,
    RoleEditComponent,
    RoleDeleteComponent,
    UserDeleteComponent,
    ConfirmModalWorklogComponent,
    SkillsComponent,
    SkillEditComponent,
    SkillDeleteComponent,
    SkillTypesComponent,
    SkillTypeEditComponent,
    SkillTypeDeleteComponent,
    DifficultyLevelsComponent,
    DifficultyEditComponent,
    DifficultyDeleteComponent,
    AchievementsComponent,
    AchievementEditComponent,
    CreateInviteComponent,
    EditInviteComponent,
    ShowInviteComponent,
    InvitedDeleteComponent,
    FaqComponent,
    SectionEditComponent,
    FormInviteComponent,
  ],
  entryComponents: [
    UserEditComponent,
    RoleEditComponent,
    RoleDeleteComponent,
    UserDeleteComponent,
    ConfirmModalWorklogComponent,
    SkillTypeEditComponent,
    SkillTypeDeleteComponent,
    SkillEditComponent,
    SkillDeleteComponent,
    DifficultyEditComponent,
    DifficultyDeleteComponent,
    AchievementEditComponent,
  ]
})
export class AdminModule { }
