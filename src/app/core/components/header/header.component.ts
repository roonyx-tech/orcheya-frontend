import { Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { CurrentUserService, SkillsService, UsersListService } from '../../services';
import { Skill } from '@models';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

/**
 * This's header component.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  @ViewChild('searchInput', { static: false }) searchElement: ElementRef;
  @ViewChild('dropdown', { static: false }) drop: BsDropdownDirective;

  public impersonatedMode: boolean = !!localStorage.getItem('impersonatedMode');
  public allSkills: Array<Skill>;
  public searchString = '';
  public environment = environment.environment;

  private destroyed = new Subject();

  constructor(
    public currentUser: CurrentUserService,
    private router: Router,
    private userListService: UsersListService,
    private skillsService: SkillsService,
    @Inject(DOCUMENT) public document: Document,
  ) {
    this.skillsService.getAllSkills()
      .pipe(takeUntil(this.destroyed))
      .subscribe((skills: Array<Skill>) => {
        this.allSkills = skills;
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public search(): void {
    if (this.searchString) {
      this.router.navigate(['/search'], { queryParams: { searchString: this.searchString }});
      this.searchString = '';
    }
  }

  public sidebarToggle(): void {
    this.document.body.clientWidth < 768 ?
      this.document.body.classList.toggle('sidebar-open') :
      this.document.body.classList.toggle('sidebar-collapse');
  }

  public signOut(): void {
    this.currentUser.signOut()
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.router.navigate(['/sign-in']);
        if (localStorage.pathToUpdate) {
          localStorage.removeItem('pathToUpdate');
        }
      });
  }

  public stopImpersonateUser(): void {
    this.currentUser.stopImpersonateUser()
      .pipe(takeUntil(this.destroyed))
      .subscribe((canStopImpersonate: boolean) => {
        if (canStopImpersonate) {
          window.location.reload();
        } else {
          this.signOut();
        }
      });
  }

  public goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
