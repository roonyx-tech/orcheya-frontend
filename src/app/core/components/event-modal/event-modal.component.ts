import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { CalendarEvent, Project, Tag, User } from '../../models';
import { EventService, CurrentUserService, ProjectService } from '../../services';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DATEPICKER_CONFIG } from './date-picker-config';
import { EVENT_TYPES } from '../../../constants';
import { TIME_ITEMS } from './time-mock';
import { TrackService } from '../../../shared/services/track.service';

const DEFAULT_VISIBLE_OPTIONS = {
  title: true,
  allDay: true,
  endDate: true,
  time: true,
  project: false,
  user: true,
  description: 'Description',
  status: false,
  tag: true,
  approving: false,
};

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss']
})

export class EventModalComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('focusInput') private focusInput: ElementRef;

  public visible = DEFAULT_VISIBLE_OPTIONS;
  public bsConfig = DATEPICKER_CONFIG;
  public timeItems = TIME_ITEMS;
  public visibleUsers = false;
  public visibleProjects = false;
  public users: Observable<User[]>;
  public projects: Observable<Project[]>;
  public searchProjectInput = new Subject<string>();
  public eventTypes = EVENT_TYPES;
  public availableTypes;
  public onCreatedEvent: EventEmitter<CalendarEvent> = new EventEmitter();
  public onUpdatedEvent: EventEmitter<CalendarEvent> = new EventEmitter();
  public onDeletedEvent: EventEmitter<number> = new EventEmitter();
  private inputEvent: CalendarEvent;
  public tags = new Array<Tag>();
  private subscribtion = new Subscription();
  private isInputFocused = false;
  public busy = false;
  private respErrors;

  constructor(
    public currentUserService: CurrentUserService,
    private eventService: EventService,
    private projectService: ProjectService,
    private modalRef: BsModalRef,
    private trackService: TrackService,
  ) {
    this.availableTypes = Object.keys(EVENT_TYPES);
  }

  canCreateType(type) {
    if (type === 'holiday') {
      return this.currentUserService.hasPermissions('calendar:holidays');
    } else {
      return true;
    }
  }

  ngOnInit() {
    this.event = new CalendarEvent(this.event || {});
    this.event.start = this.event.start ? new Date(this.event.start) : new Date();
    this.event.end = this.event.end ? new Date(this.event.end) : new Date();

    this.trackService.track(`event_modal_${ this.event.id ? 'show' : 'new' }` );
    this.eventService.getTags().subscribe(tags => {
      this.tags = tags;
    });
  }

  get event(): CalendarEvent {
    return this.inputEvent;
  }

  set event(value: CalendarEvent) {
    this.inputEvent = value;
    this.setType(value.type);
  }

  getTimeValueFrom(date: Date): number {
    const minutes = Math.floor(date.getMinutes() / 30) * 30;
    const hours = date.getHours();
    const value = (hours * 60 + minutes) * 60;
    if (this.timeItems[0].value > value) {
      return this.timeItems[0].value;
    } else if (this.timeItems[this.timeItems.length - 1].value < value) {
      return this.timeItems[this.timeItems.length - 1].value;
    } else {
      return value;
    }
  }

  changeDateByTime(date: Date, value: number): void {
    date.setSeconds(0);
    date.setHours(Math.floor(value / 3600));
    date.setMinutes(Math.floor(value % 60 / 60));
  }

  get startTime(): number { return this.getTimeValueFrom(this.inputEvent.start); }
  set startTime(value: number) { this.changeDateByTime(this.inputEvent.start, value); }
  get endTime(): number { return this.getTimeValueFrom(this.inputEvent.end); }
  set endTime(value: number) { this.changeDateByTime(this.inputEvent.end, value); }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

  ngAfterViewChecked() {
    if (!this.isInputFocused && this.focusInput) {
      this.focusInput.nativeElement.focus();
    }
  }

  public hasError(controlName: string): boolean {
    return this.respErrors && this.respErrors[controlName];
  }

  public textError(controlName: string): string {
    const msg = this.respErrors && this.respErrors[controlName];
    return Array.isArray(msg) ? msg.join(', ') : msg;
  }

  public setType(key: string): void {
    this.event.type = key || this.availableTypes[0];
    this.visible = Object.assign({}, DEFAULT_VISIBLE_OPTIONS);
    switch (key) {
      case 'holiday':
        this.visible.time = false;
        this.visible.allDay = false;
        this.visible.endDate = false;
        this.visible.tag = false;
        this.visible.user = false;
        break;
      case 'vacation':
        this.visible.title = false;
        this.visible.allDay = false;
        this.visible.time = false;
        this.visible.status = true;
        this.visible.description = 'Comment';
        this.visible.tag = false;
        this.visible.approving = true;
        break;
      case 'project':
        this.visible.project = true;
        break;
    }
  }

  public changeFocus(): void {
    this.isInputFocused = true;
  }

  public closeModal(): void {
    this.modalRef.hide();
  }

  public save(): void {
    this.event.id ? this.updateEvent() : this.createEvent();
  }

  public onSelectUser(user: User): void {
    if (user) {
      this.event.userId = user.id;
    }
  }

  private createEvent(): void {
    this.busy = true;
    this.respErrors = {};
    this.eventService.addEvent(this.event)
      .subscribe(
        newEvent => {
          this.busy = false;
          this.onCreatedEvent.emit(newEvent);
          this.modalRef.hide();
        },
        res => {
          this.busy = false;
          this.respErrors = res.error;
        }
      );
  }

  private updateEvent(): void {
    this.busy = true;
    this.respErrors = {};
    this.eventService.updateEvent(this.event)
      .subscribe(
        (updatedEvent: CalendarEvent) => {
          this.busy = false;
          this.onUpdatedEvent.emit(updatedEvent);
          this.modalRef.hide();
        },
        res => {
          this.busy = false;
          this.respErrors = res.error;
        }
      );
  }

  public deleteEvent(): void {
    if (confirm('Do you really want delete this event?')) {
      this.busy = true;
      this.eventService.deleteEvent(this.event.id)
        .subscribe(
          event => {
            this.busy = false;
            this.onDeletedEvent.emit(this.event.id);
            this.modalRef.hide();
          },
          err => {
            this.busy = false;
          }
        );
    }
  }

  public approve(): void {
    this.busy = true;
    this.respErrors = {};
    this.eventService.approve(this.event.id)
      .subscribe(
        (updatedEvent: CalendarEvent) => {
          this.busy = false;
          this.onUpdatedEvent.emit(updatedEvent);
          this.modalRef.hide();
        },
        res => {
          this.busy = false;
          this.respErrors = res.error;
        }
      );
  }

  public disapprove(): void {
    this.busy = true;
    this.respErrors = {};
    this.eventService.disapprove(this.event.id, this.event.description)
      .subscribe(
        (updatedEvent: CalendarEvent) => {
          this.busy = false;
          this.onUpdatedEvent.emit(updatedEvent);
          this.modalRef.hide();
        },
        res => {
          this.busy = false;
          this.respErrors = res.error;
        }
      );
  }

}
