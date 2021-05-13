import { Component } from '@angular/core';

import { CurrentUserService } from '@core-services';
import { User } from '@models';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
  public isSlackOpen = false;
  public isDiscordOpen = false;

  constructor(public currentUser: CurrentUserService) {}

  public onSlackSettings(): void {
    this.isSlackOpen = !this.isSlackOpen;
  }

  public onDiscordSettings(): void {
    this.isDiscordOpen = !this.isDiscordOpen;
  }

  public onSlackChange(notifyUpdate): void {
    const updateUser = new User();
    updateUser.notifyUpdate = notifyUpdate;

    this.currentUser
      .updateSettings(updateUser)
      .subscribe();
  }

  public onDiscordChange(discordNotifyUpdate): void {
    const updateUser = new User();
    updateUser.discordNotifyUpdate = discordNotifyUpdate;

    this.currentUser
      .updateSettings(updateUser)
      .subscribe();
  }
}
