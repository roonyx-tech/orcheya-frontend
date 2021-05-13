import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal-worklog',
  templateUrl: './confirm-modal-worklog.component.html',
  styleUrls: ['./confirm-modal-worklog.component.scss']
})
export class ConfirmModalWorklogComponent {
  public onUpdateWorklog: EventEmitter<boolean> = new EventEmitter();
  public worklogControlState: any;

  constructor(private bsModalRef: BsModalRef) {}

  public confirmation(answer: boolean): void {
    this.bsModalRef.hide();
    this.onUpdateWorklog.emit(answer);
  }
}
