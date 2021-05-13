import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';

import { CurrentUserService } from './current-user.service';

@Injectable()
export class PermissionGuard implements CanActivate {


  constructor(private currentUser: CurrentUserService,
              private router: Router) {
  }

  public canActivate(): Observable<boolean> | boolean {

    return new Observable((observer: Observer<boolean>) => {

      this.currentUser.load()
        .subscribe(
          () => null,
          () => null,
          () => {
            if (this.currentUser.registrationFinished) {
              observer.next(true);
              observer.complete();
            } else {
              this.router.navigate(['/sign-in']);
              observer.next(false);
            }
          }
        );
    });
  }
}
