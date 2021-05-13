import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JWTTokenInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token: string = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(catchError(this.handleError));
  }

  private handleError(err: any) {
    if (err instanceof HttpErrorResponse && err.status === 401) {
      localStorage.removeItem('token');
    }

    return throwError(err);
  }
}
