import {
  Component, ViewChild, AfterViewChecked,
  AfterViewInit, ChangeDetectorRef, OnInit, OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import {
  CurrentUserService,
  UsersListService,
  UserLinksService,
  SkillsService,
  EventService
} from '../../services';
import {
  User,
  TimeGraphTypes,
  TimeGraphFilter,
  TimeActivity,
  CalendarEvent,
  AchievementUser,
} from '@models';
import { EventModalComponent } from '../../components';
import { SERVICES } from '../../components/user-links/allowed-services';
import { HttpParams } from '@angular/common/http';
import { TrackService } from '../../../shared/services/track.service';
import { switchMap } from 'rxjs/operators';
import { of, race, Subject, zip} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit,
  AfterViewInit, AfterViewChecked, OnDestroy {

  @ViewChild('tabset')
  public tabset: TabsetComponent;
  public user: User;
  public userStats;
  public isCurrUser = false;
  public filter = new TimeGraphFilter();
  public tgTypes = TimeGraphTypes;
  public activityData: TimeActivity[];
  public userLinksData: any;
  public highestSkills: string;
  public vacations: CalendarEvent[];
  public truncatedVacations: CalendarEvent[];
  public userId: number;
  public achievements: Array<AchievementUser> = [];
  public showAllVacations = false;
  public vacationQueryId: number;
  public environment = environment.environment;

  private destroy$ = new Subject();

  constructor(
    public currentUser: CurrentUserService,
    public ts: TrackService,
    private userListService: UsersListService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private linksService: UserLinksService,
    private skillsService: SkillsService,
    private eventService: EventService,
  ) {
    this.route.params.pipe(switchMap(item => {
      this.filter.id = item.id;
      return this.activatedRouter.queryParams;
    })).subscribe(res => res.vacation ? this.vacationQueryId = res.vacation : null);
  }

  ngOnInit() {
    this.isCurrUser = this.filter.id === this.currentUser.id;

    if (!this.isCurrUser && this.filter.id) {
      this.userListService.getUserById(this.filter.id).pipe(takeUntil(this.destroy$))
        .subscribe(user => {
          this.user = user;
        });
    } else {
      this.user = this.currentUser;
      this.filter.id = this.user.id;
      this.isCurrUser = true;
    }

    this.userId = this.isCurrUser ? this.currentUser.id : this.filter.id;
    this.linksService.getUserLinks(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    this.userLinksData = this.linksService.userLinksData;

    this.skillsService.getHighestSkills(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => this.highestSkills = res);

    this.userListService
      .getUserTimeStatsById(this.filter.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.userStats = data);

    this.userListService
      .getUserAchievementsById(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Array<AchievementUser>) => this.achievements = data);
    this.initVacations();
  }

  ngAfterViewInit() {
    this.activatedRouter.queryParams
      .subscribe(res => res.tab ? this.checkActiveTab(res.tab) : null);
    this.getIntegrationTime();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public checkKindAchievements(achievement: AchievementUser, bestAchievement?: string): string {
    if (bestAchievement) {
      return achievement.kind === 'auto' ? `Best result - ${achievement.bestResult}` : null;
    } else {
      return achievement.kind !== 'auto'
        ? `Unlocked ${moment(achievement.createAt).format('DD.MM.YYYY')}`
        : `${achievement.score} / ${achievement.nextLevelScore}`;
    }
  }

  public generationGradient(achievement: AchievementUser, type?: string): string {
    return type
      ? `linear-gradient(90deg, #a7a7a780 ${(achievement.score * 100) / achievement.nextLevelScore}%, #FFF 0%)`
      : `radial-gradient(100% 100% at 0% 0%, ${achievement.color} 0%, ${achievement.secondColor} 40%, ${achievement.thirdColor} 100%)`;
  }

  public toggleContent(state: string): void {
    this[`${state}`] = !this[`${state}`];
  }

  private initVacations(): void {
    const eventParams = new HttpParams()
      .set('user_ids[]', this.filter.id.toString())
      .set('type', 'vacation');

    zip(
      this.eventService.getEvents(eventParams),
      this.vacationQueryId ? this.eventService.getEvent(this.vacationQueryId) : of(null)
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(([vacations, vacationQuery]) => {
        this.truncateVacation(vacations);
        if (vacationQuery && this.canEditVacation()) {
          const exist = this.vacations.find(element => element.id === vacationQuery.id);
          exist ? this.editVacation(exist) : confirm(`This vacation not found`);
          this.vacationQueryId = undefined;
        }
      }, () => this.router.navigate(['/not-found']));
  }

  public get vacationDefinition(): CalendarEvent[] {
    return this.showAllVacations ? this.vacations : this.truncatedVacations;
  }

  public defineArrowClass(state: boolean): string {
    return `box-toggle-${state ? 'open' : 'close'} fa fa-angle-down`;
  }

  public checkSelected(source, update): boolean {
    return this.filter.source === source && this.filter.update === update;
  }

  public onIntegrationChange(source, update): void {
    if (this.filter.source === source && this.filter.update === update) {
      this.filter.source = undefined;
      this.filter.update = true;
    } else {
      this.filter.source = source;
      this.filter.update = update;
    }
    this.getIntegrationTime();
  }

  public onTabSelect(tab): void {
    this.changeTabUri(tab);
  }

  public onButtonClick(): void {
    const tab = 'settings';
    this.changeTabUri(tab);
    this.checkActiveTab(tab);
  }

  private truncateVacation(vacations): void {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0);
    this.vacations = vacations.sort((a, b) => +new Date(b.start) - +new Date(a.start));
    this.truncatedVacations = this.vacations.filter(vacation => new Date(vacation.end) >= currentDate);
  }

  private checkActiveTab(tab?: string): void {
    if (!tab && !this.route.snapshot.queryParamMap.has('tab')) {
      return;
    }

    const activeTabName = tab
      ? tab : this.route.snapshot.queryParamMap.get('tab');

    const currentTab = this.tabset.tabs
      .find((tabDir: TabDirective) => tabDir.id === activeTabName);

    if (currentTab) {
      currentTab.active = true;
    }
  }

  private changeTabUri(tab: string): void {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { tab },
    });
  }

  public calcDays(vacation: CalendarEvent): number {
    const startTime = new Date(vacation.start).getTime();
    const endTime = new Date(vacation.end).getTime();

    return Math.round((endTime - startTime) / (1000 * 60 * 60 * 24));
  }

  public editVacation(vacation: CalendarEvent): void {
    const modalState = {
      class: 'modal-dialog-centered',
      initialState: {
        event: vacation
      }
    };
    const modalRef = this.modalService.show(EventModalComponent, modalState);

    race(
      modalRef.content.onUpdatedEvent,
      modalRef.content.onDeletedEvent
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      if (!this.isCurrUser && this.filter.id) {
        this.userListService.getUserById(this.filter.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(user => this.user = user);
      } else {
        this.currentUser.load().subscribe(user => this.user = user);
      }
      this.initVacations();
    });
  }

  public canEditVacation(): boolean {
    return this.isCurrUser || this.currentUser.hasSomePermissions(['calendar:vacation', 'calendar:manage_all']);
  }

  private getIntegrationTime(): void {
    if (this.filter.paid) {
      this.filter.paid = undefined;
      this.filter.source = undefined;
    } else if (this.filter.source === 3) {
      this.filter.paid = true;
      this.filter.source = undefined;
    } else {
      this.filter.paid = undefined;
    }

    this.userListService
      .getIntegrationTime(this.filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.activityData = data);
  }

  public slackUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      `slack://user?team=${this.user.slackTeamId}&id=${this.user.slackId}`
    );
  }

  public makeIconClassName(kind: string): string {
    return SERVICES[kind] ? `fa-${SERVICES[kind].icon}` : 'fa-link';
  }

  public checkKindName(kind: string): string {
    return SERVICES[kind] ? `${SERVICES[kind].name}` : 'custom';
  }

  get skypeUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      `skype:${this.user.skype}?call`
    );
  }

  public addVacation(): void {
    const modalState = {
      class: 'modal-dialog-centered',
      initialState: {
        event: new CalendarEvent({ type: 'vacation' })
      }
    };
    const modalRef = this.modalService.show(EventModalComponent, modalState);
    modalRef.content.onCreatedEvent.subscribe(() => this.initVacations());
  }
}
