import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '../../services';
import { environment } from '../../../../environments/environment';
/**
 * This page is necessary by logged in.
 */

@Component({
  selector: 'app-sign-in',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {
  public errors: any;
  public noMatch = false;
  public environment = environment;
  private token = '';

  constructor(private currentUser: CurrentUserService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params.token;
    });
  }

  public setPassword(formValue: any): void {
    if (formValue.password !== formValue.password_confirmation) {
      this.noMatch = true;
      return;
    }

    this.currentUser
      .setNewPassword(formValue.password, this.token)
      .subscribe(
        (data) => {
          this.router.navigate(['/sign-in']);
          this.errors = {};
        },
        (err) => {
          console.error(err);
          this.errors = err.error.errors;
        }
      );
  }

  public removeDontMatch(): void {
    this.noMatch = false;
  }

}
