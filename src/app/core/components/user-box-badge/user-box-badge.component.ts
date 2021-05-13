import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { User, UserWorktime } from '@models';
import { WaitingComponent } from '../waiting/waiting.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CurrentUserService, UserWorktimeService } from '@core-services';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-box-badge',
  templateUrl: './user-box-badge.component.html',
  styleUrls: ['./user-box-badge.component.scss']
})
export class UserBoxBadgeComponent implements OnInit, OnChanges {
  @Input() public user: User;
  @Input() public bestUsers: Array<User>;
  @Input() public isCurrentUser = false;
  public data: UserWorktime;

  private modalRef: BsModalRef;
  private modalOptions = new ModalOptions();

  constructor(
    private currentUser: CurrentUserService,
    private modalService: BsModalService,
    private worktimeService: UserWorktimeService,
  ) { }

  public onChange(file: File): void {
    this.modalRef = this.modalService.show(WaitingComponent, this.modalOptions);

    const subscription = this.currentUser
      .uploadAvatar(file)
      .subscribe();

    this.modalRef.content.imageSubscriptions = [
      this.currentUser.avatarSubscription,
      subscription,
    ];
  }


  ngOnInit() {
    this.modalOptions.initialState = {
      title: 'Image uploader', progressSubject: this.currentUser.progressSubject, successMessage: 'Image is successfully uploaded'
    } as Partial<any>;
    this.modalOptions.keyboard = false;
    this.modalOptions.ignoreBackdropClick = true;
    this.modalOptions.class = 'modal-center';
  }

  ngOnChanges() {
    if (this.user) {
      this.worktimeService.load(this.user.id).subscribe(data => this.data = data);
    }
  }

  getClass(data: UserWorktime): string {
    if (data && data.timerOn) {
      return data.balance < 0 ? 'danger' : 'success';
    } else {
      return 'default';
    }
  }
}
