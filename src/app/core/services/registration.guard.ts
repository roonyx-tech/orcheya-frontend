import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';

import { CurrentUserService } from './current-user.service';

@Injectable()
export class RegistrationGuard implements CanActivate {
  constructor(public currentUser: CurrentUserService,
              private router: Router) {
  }

  public canActivate(): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      if (this.currentUser.registrationFinished) {
        this.router.navigate(['/profile']);
        observer.next(false);
      } else {
        observer.next(true);
        observer.complete();
      }
    });
  }
}
