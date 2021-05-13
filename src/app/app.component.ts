import { Component, HostListener, Renderer2, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TrackService } from './shared/services/track.service';
import { Angulartics2GoogleGlobalSiteTag } from 'angulartics2/gst';
import { Angulartics2 } from 'angulartics2';
import { environment } from 'src/environments/environment';

/**
 * This's main component of application.
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public body = document.querySelector('body');

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const windowWidth = event.target.innerWidth;
    if (windowWidth < 768) {
      this.deleteSidebarCollapse();
    }
  }

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private trackService: TrackService,
    // private metrika: Metrika,
    public location: Location,
    public angulartics2: Angulartics2,
    public angulartics2GoogleGlobalSiteTag: Angulartics2GoogleGlobalSiteTag
  ) {
    // let prevPath = this.location.path();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        trackService.trackUrl(event.urlAfterRedirects);

        // Yandex Metric
        // if (environment.production) {
        //   const newPath = this.location.path();
        //   this.metrika.hit(newPath, {
        //     referer: prevPath,
        //   });
        //   prevPath = newPath;
        // }
      }
    });

    angulartics2.settings.developerMode = !environment.production;
    angulartics2GoogleGlobalSiteTag.startTracking();
  }

  ngOnInit() {
    this.checkWindowWidth();
  }

  public checkWindowWidth(): void {
    if (window.innerWidth < 768) {
      this.deleteSidebarCollapse();
    }
  }

  public deleteSidebarCollapse(): void {
    this.renderer.removeClass(this.body, 'sidebar-collapse');
  }
}
