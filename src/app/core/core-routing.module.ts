import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  CurrentUserGuard,
  RegistrationGuard,
  PermissionGuard
} from './services';

import { CoreComponent } from './core.component';
import {
  AcceptInviteComponent,
  FaqSectionsComponent,
  FaqSectionComponent,
  RegistrationComponent,
  SignInComponent,
  SetPasswordComponent,
  ResetPasswordComponent,
  UpdatesComponent,
  UserProfileComponent,
  UsersListComponent,
  IntegrationsComponent,
  NewUpdateComponent,
  CalendarComponent,
  ErrorComponent,
  DashboardComponent
} from './pages';
import { PermissionsGuard } from '@admin-services';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    canActivate: [CurrentUserGuard, PermissionGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'users-list', component: UsersListComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'user-profile/:id',
        component: UserProfileComponent,
        canActivate: [CurrentUserGuard]
      },
      { path: 'updates', component: UpdatesComponent },
      {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [CurrentUserGuard]
      },
      { path: 'faq', component: FaqSectionsComponent},
      { path: 'faq/:sectionId', component: FaqSectionComponent },
      { path: 'admin',
        loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'update',
        component: NewUpdateComponent,
        canActivate: [CurrentUserGuard]
      }
    ]
  },
  { path: 'sign-in', component: SignInComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'set-password', component: SetPasswordComponent },
  { path: 'invitation/:token', component: AcceptInviteComponent },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [RegistrationGuard]
  },
  {
    path: 'integrations',
    component: IntegrationsComponent,
    canActivate: [CurrentUserGuard]
  },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
