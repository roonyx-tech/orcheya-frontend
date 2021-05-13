import { Component, Input } from '@angular/core';
import { Notification } from '@models';
import { NotificationsService } from '@core-services';
import { environment } from '../../../../environments/environment';

@Component({
  selector: '[app-notifications]', // tslint:disable-line
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  public environment = environment.environment;

  constructor(private notifyService: NotificationsService) {}

  @Input() notifications: Array<Notification>;

  public read(id: number): void {
    this.notifyService.read(id)
      .subscribe(
        res => {
          const index = this.notifications.findIndex(n => n.id === id);
          this.notifications.splice(index, 1);
        }
      );
  }

  public readAll(): void {
    this.notifyService.readAll()
      .subscribe(
        res => this.notifications = []
      );
  }
}
