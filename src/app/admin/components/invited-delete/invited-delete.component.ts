import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { User } from '@models';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CurrentUserService } from '@core-services';
import { OnboardingService } from '@admin-services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-invited-delete',
  templateUrl: './invited-delete.component.html'
})
export class InvitedDeleteComponent implements OnDestroy {
  public user: User;
  public onUserInvitedDelete: EventEmitter<User> = new EventEmitter();

  private destroy$ = new Subject();

  constructor(
    public bsModalRef: BsModalRef,
    public currentUser: CurrentUserService,
    private onBoardingService: OnboardingService
  ) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get showNameOrEmail(): string {
    let str: string;
    if (this.user.invitationToken) {
      str = this.user.email;
    } else {
      str = `${this.user.name} ${this.user.surname}`;
    }
    return str;
  }

  public delete(): void {
    this.onBoardingService
      .removeUserInvited(this.user)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onUserInvitedDelete.emit(this.user);
      });
  }
}
