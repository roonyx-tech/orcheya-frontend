import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, Observer } from 'rxjs';

import { CurrentUserService } from './current-user.service';

/**
 * This component, which can to give permissions for load another component.
 */

@Injectable()
export class CurrentUserGuard implements CanActivate {

  constructor(private currentUser: CurrentUserService,
              private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> |
                                                     boolean {
    if (this.currentUser.isLoggedIn()) {
      if (parseInt(route.params.id, 10) === this.currentUser.id) {
        this.router.navigate(['/profile']);
      }
      return true;
    }
    return new Observable((observer: Observer<boolean>) => {
      if (window.location.pathname === '/update') {
        const savedPath = {
          pathName: window.location.pathname,
          params: window.location.search
        };
        localStorage.setItem('pathToUpdate', JSON.stringify(savedPath));
      }
      this.currentUser.load()
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          () => {
            this.router.navigate(['/sign-in']);
            observer.next(false);
          }
        );
    });
  }
}
