import { Component } from '@angular/core';
import { CurrentUserService } from '../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent  {
  private defaultIntegrations = ['discord', 'timedoctor'];
  private invitationIntegrations: string[];

  constructor(
    public currentUser: CurrentUserService,
    private router: Router,
  ) {
    this.invitationIntegrations =
      JSON.parse(localStorage.getItem('invitationIntegrations')) || this.defaultIntegrations;
  }

  public navigateToProfile(): void {
    this.router.navigate(['/profile']);
    localStorage.removeItem('invitationIntegrations');
  }

  public isIncluded(integration: string): boolean {
    return this.invitationIntegrations && this.invitationIntegrations.map(str => str.toLowerCase()).includes(integration);
  }
}
