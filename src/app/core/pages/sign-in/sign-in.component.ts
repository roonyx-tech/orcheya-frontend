import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { CurrentUserService } from '../../services';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
/**
 * This page is necessary by logged in.
 */

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  public form: FormGroup;
  public environment = environment.environment;
  public isLoading = false;
  public serverError = '';

  constructor(
    private currentUser: CurrentUserService,
    private router: Router,
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  public signIn(): void {
    this.isLoading = true;
    this.serverError = '';
    this.currentUser
      .signIn(this.form.value.email, this.form.value.password)
      .subscribe(
        () => {
          this.currentUser.load().subscribe(() => {
            if (this.currentUser.registrationFinished) {
              if (localStorage.pathToUpdate) {
                const parsedPath = JSON.parse(localStorage.pathToUpdate);
                const pathToUpdate = parsedPath.pathName;
                const pathToUpdateParams = parsedPath.params.substring(6, 16);

                this.router.navigate(
                 [pathToUpdate],
                 {
                   queryParams: {
                     date: pathToUpdateParams
                   }
                 }
               );
                localStorage.removeItem('pathToUpdate');
               } else {
                 this.router.navigate(['/dashboard']);
               }
              } else {
                this.router.navigate(['/registration']);
              }
            this.isLoading = false;
            this.serverError = '';
            }
          );
        },
        (errorResponse) => {
          const timeout = setTimeout(() => {
            if (errorResponse.error && errorResponse.error.error) {
              this.serverError = errorResponse.error.error;
            } else {
              this.serverError = 'Unknown server error, contact administrator.';
            }
            this.isLoading = false;
            clearTimeout(timeout);
          }, 600);
        }
     );
   }
}
