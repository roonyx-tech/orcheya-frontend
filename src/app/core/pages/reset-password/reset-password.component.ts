import { Component } from '@angular/core';

import { CurrentUserService } from '../../services';
import { environment } from '../../../../environments/environment';
/**
 * This page is necessary by logged in.
 */

@Component({
  selector: 'app-sign-in',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  public errors = false;
  public sent = false;
  public environment = environment;

  constructor(private currentUser: CurrentUserService) {}

  public resetPassword(formValue: any): void {
    this.currentUser.sendPasswordReset(formValue.email)
      .subscribe(() => {
        this.errors = false;
        this.sent = true;
        }, () => this.errors = true);
  }
}
