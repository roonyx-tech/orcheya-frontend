import { Component, Input } from '@angular/core';
import { IntegrationsService } from '../../../services/integrations.service';

@Component({
  selector: 'app-slack-connect-button',
  templateUrl: './slack-button.component.html',
  styleUrls: ['./slack-button.component.scss']
})
export class SlackButtonComponent {
  @Input() connected = false;
  @Input() connectName = 'Connect';
  @Input() disconnectName = 'Disconnect';

  constructor(private integrationService: IntegrationsService) {}

  public onClick() {
    this.connected
      ? this.disconnect()
      : this.connect();
  }

  private connect() {
    this.integrationService.slackConnect();
  }

  private disconnect() {
    this.integrationService
      .slackDisconnect()
      .subscribe();
  }
}
