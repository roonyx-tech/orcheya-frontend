import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-show-invite',
  templateUrl: './show-invite.component.html',
  styleUrls: ['./show-invite.component.scss']
})
export class ShowInviteComponent {
  public urlInvite: string;
  public invite: EventEmitter<string> = new EventEmitter();

  constructor(
    public bsModalRef: BsModalRef,
    private notifierService: NotifierService
  ) {}

  public notifier(): void {
    this.notifierService.notify('success', 'Link form-invite copied');
  }

  public closeModal(): void {
    this.bsModalRef.hide();
  }
}
