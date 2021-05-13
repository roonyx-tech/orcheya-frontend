import { Component, Input } from '@angular/core';
import { IntegrationsService } from '../../../services/integrations.service';

@Component({
  selector: 'app-discord-connect-button',
  templateUrl: './discord-button.component.html',
  styleUrls: ['./discord-button.component.scss']
})
export class DiscordButtonComponent {
  @Input() public connected;

  constructor(private integrationService: IntegrationsService) {}

  public onClick(): void {
    this.connected
      ? this.disconnect()
      : this.connect();
  }

  private connect(): void {
    this.integrationService.discordConnect();
  }

  private disconnect(): void {
    this.integrationService
      .discordDisconnect()
      .subscribe();
  }
}
