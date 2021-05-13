import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import {
  PermissionsGuard
} from './services';
import {
  UsersComponent,
  RolesComponent,
  SkillsComponent,
  AchievementsComponent,
  FaqComponent,
  CreateInviteComponent,
  EditInviteComponent,
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'users',
        component: UsersComponent,
        data: { permissions: 'users:crud' },
        canActivate: [PermissionsGuard] },
      { path: 'create-invite',
        component: CreateInviteComponent,
        data: { permissions: 'users:crud' },
        canActivate: [PermissionsGuard] },
      { path: 'edit-invite/:id',
        component: EditInviteComponent,
        data: { permissions: 'users:crud' },
        canActivate: [PermissionsGuard] },
      { path: 'skills', component: SkillsComponent,
        data: { permissions: 'admin:skills' },
        canActivate: [PermissionsGuard] },
      { path: 'achievements', component: AchievementsComponent,
        data: { permissions: 'admin:achievements' },
        canActivate: [PermissionsGuard] },
      { path: 'roles',
        component: RolesComponent,
        data: { permissions: 'admin:roles' },
        canActivate: [PermissionsGuard] },
      { path: 'faq',
        component: FaqComponent,
        data: { permissions: 'admin:faq' },
        canActivate: [PermissionsGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
