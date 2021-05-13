import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { CurrentUserService } from '@core-services';
import { Observable, Observer } from 'rxjs';
import { NotifierService } from 'angular-notifier';

@Injectable()
export class PermissionsGuard implements CanActivate {

  constructor(private currentUser: CurrentUserService,
              private router: Router,
              private notifier: NotifierService) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      if (route.data && route.data.permissions) {
        if (this.currentUser.hasPermissions(route.data.permissions)) {
          observer.next(true);
          observer.complete();
        } else {
          this.notifier.notify( 'warning', 'You have no permission to perform this action.');
          console.error('Have no permissions ', route.data.permissions);
          this.router.navigate(['/']);
          observer.next(false);
        }
      } else {
        observer.next(true);
        observer.complete();
      }
    });
  }
}
