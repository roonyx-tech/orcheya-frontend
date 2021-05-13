import {
  Component, OnInit, ViewChild,
  ElementRef, Renderer2, OnDestroy,
} from '@angular/core';

import { SidebarService } from '../shared/sidebar';
import { ScrollService } from './services';
import { environment } from '../../environments/environment';
import { PRODUCTION_MENU } from '@consts';

@Component({
  selector: 'app-wrapper',
  templateUrl: './core.component.html',
  styleUrls: ['core.component.scss']
})
export class CoreComponent implements OnInit, OnDestroy {
  @ViewChild('wrapper', { static: true }) private wrapper: ElementRef;

  private listener: () => void;
  private environment = environment.environment;

  constructor(
    private sideBarService: SidebarService,
    private scrollService: ScrollService,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.initScrollHandler();
    this.sideBarService.add(PRODUCTION_MENU);
  }

  ngOnDestroy() {
    if (this.listener) {
      this.listener();
    }
  }

  private initScrollHandler(): void {
    this.listener = this.renderer
      .listen(
        this.wrapper.nativeElement,
        'scroll',
        event => (
          this.scrollService
            .scrollPage
            .next(event)
        )
      );
  }
}
