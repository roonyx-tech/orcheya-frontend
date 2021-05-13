import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-invite',
  template: `<app-form-invite [userId]="userId"></app-form-invite>`,
})
export class EditInviteComponent {
  public userId: string;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(item => this.userId = item.id);
  }
}
