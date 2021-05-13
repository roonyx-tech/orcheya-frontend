import { Component, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CurrentUserService, EventService, UsersListService } from '../../services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CalendarEvent, EventTag, User } from '@models';
import { EventModalComponent } from '../../components';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { HttpParams } from '@angular/common/http';
import { eventBGColor } from '@consts';
import { map, takeUntil } from 'rxjs/operators';
import { validationMessage } from '@shared-helpers';
import { NotifierService } from 'angular-notifier';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  @ViewChild('calendar', { static: true }) calendar: FullCalendarComponent;

  public calendarPlugins = [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin];
  public calendarHeader = {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,list'
  };
  public events: CalendarEvent[];
  public users: Array<User>;
  public eventSources: Array<any> = [];
  public optionEvents: Array<string> = ['Event', 'Vacation', 'Holidays'];

  private destroyed = new Subject();

  constructor(
    public currentUser: CurrentUserService,
    public modal: BsModalService,
    private eventService: EventService,
    private usersListService: UsersListService,
    private notifier: NotifierService
  ) {
    this.eventSources = [ this.fetchEvents.bind(this) ];
  }

  fetchEvents(info, successCallback, failureCallback): void {
    const params = new HttpParams()
      .set('start', info.startStr)
      .set('finish', info.endStr)
      .set('type[]', 'vacation')
      .append('type[]', 'holiday')
      .append('type[]', 'common');
    this.eventService.getEvents(params).subscribe((events: CalendarEvent[]) => {
      this.events = events;
      const calendarApi = this.calendar.getApi();
      calendarApi.removeAllEvents();
      successCallback(this.transformEvents(events));
    });
  }

  filter(): void {
    this.eventUsersFilter('event');
    this.eventUsersFilter('user');
  }

  eventUsersFilter(type: string): void {
    const select = document.createElement('select');
    const option = document.createElement('option');
    select.id = 'filter-dropdown';
    select.addEventListener('change', eventSelect => {
      const target = eventSelect.target as HTMLInputElement;
      const calendarApi = this.calendar.getApi();
      calendarApi.removeAllEvents();
      if (type === 'event') {
        this.events.forEach(event => event.type === target.value ? calendarApi.addEvent(event as any) : null);
      } else {
        this.events.forEach(event => event.userId === +target.value ? calendarApi.addEvent(event as any) : null);
      }
      if (target.value === `Select ${type}`) {
        calendarApi.refetchEvents();
      }
    });
    document.getElementsByClassName('fc-right')[0]?.prepend(select);
    if (type === 'event') {
      option.innerText = `Select ${type}`;
      document.getElementById('filter-dropdown').append(option);
      this.optionEvents.forEach(event => {
        const optionManager = document.createElement('option');
        optionManager.innerText = event;
        if (event === 'Event') {
          optionManager.value = 'common';
        } else if (event === 'Vacation') {
          optionManager.value = 'vacation';
        } else {
          optionManager.value = 'holiday';
        }
        document.getElementById('filter-dropdown').append(optionManager);
      });
    } else {
      this.usersListService.getUsersList()
        .pipe(
          takeUntil(this.destroyed),
          map(res => res.users)
        )
        .subscribe((users: Array<User>) => {
          option.innerText = `Select ${type}`;
          document.getElementById('filter-dropdown').append(option);
          users.forEach(user => {
            const optionManager = document.createElement('option');
            optionManager.innerText = user.fullName;
            optionManager.value = user.id.toString();
            document.getElementById('filter-dropdown').append(optionManager);
          });
        });
    }
  }

  transformEvent(event: CalendarEvent): any {
    const newEvent = Object.assign({
      backgroundColor: eventBGColor(event)
    }, event);

    if (newEvent.allDay) {
      const tmpDate = new Date(newEvent.end);
      tmpDate.setDate(tmpDate.getDate() + 1);
      newEvent.end = tmpDate;
    }
    return newEvent;
  }

  transformEvents(events: CalendarEvent[]): Array<any> {
    return events.map(event => this.transformEvent(event));
  }

  eventUpdated(info) {
    const event = this.events.find(e => e.id.toString() === info.event.id);
    event.start = info.event.start;
    if (info.event.end) {
      event.end = info.event.end;
      event.end.setDate(event.end.getDate() - 1);
    } else { event.end = event.start; }

    this.eventService
      .updateEvent(event)
      .subscribe(
        (updatedEvent: CalendarEvent) => {
          Object.assign(event, updatedEvent);
          info.event.remove();
          const calendarApi = this.calendar.getApi();
          calendarApi.addEvent(this.transformEvent(updatedEvent));
        },
        response => {
          console.error(response.error);
          this.notifier.notify( 'error', validationMessage(response));
          info.revert();
        }
      );
  }

  dateClick(info) {
    const endDate = new Date(info.date);
    endDate.setHours(endDate.getHours() + 1);
    this.showEventForm({
      start: info.date,
      end: endDate,
      allDay: info.allDay,
    } as CalendarEvent);
  }

  eventClick(info) {
    const event = this.events.find(e => e.id.toString() === info.event.id);
    this.showEventForm(event, info.event);
  }

  private showEventForm(originEvent: CalendarEvent, calendarEvent?: any) {
    const modalState = {
      class: 'modal-dialog-centered',
      initialState: {
        visibleUsers: this.currentUser.hasPermissions('calendar:manage_all'),
        users: this.usersListService.getUsersList().pipe(map(data => data.users)),
        event: originEvent,
        availableTypes: ['common', 'vacation', 'holiday'],
      },
    };
    const modalRef = this.modal.show(EventModalComponent, modalState);

    modalRef.content.onUpdatedEvent.subscribe((updatedEvent: CalendarEvent) => {
      if (calendarEvent) { calendarEvent.remove(); }
      const calendarApi = this.calendar.getApi();
      this.events = this.events.map(event => event.id === updatedEvent.id ? updatedEvent : event);
      calendarApi.addEvent(this.transformEvent(updatedEvent));
    });

    modalRef.content.onDeletedEvent.subscribe((eventId: number) => {
      if (calendarEvent) { calendarEvent.remove(); }
    });

    modalRef.content.onCreatedEvent.subscribe((updatedEvent: CalendarEvent) => {
      if (calendarEvent) { calendarEvent.remove(); }
      const calendarApi = this.calendar.getApi();
      this.events.push(updatedEvent);
      calendarApi.addEvent(this.transformEvent(updatedEvent));
    });
  }

  eventRender(info): void {
    const { event: { extendedProps: { type, eventTag, user, project, status } } } = info;
    const content = info.el.getElementsByClassName('fc-title')[0];
    info.el.style.backgroundColor = eventBGColor({ type, project, status });
    info.el.style.borderColor = eventBGColor({ type, project, status }, 'border');
    if (info.view.viewSpec.buttonTextDefault !== 'list') {
      if (user) { this.renderUserBadge(content, user); }
      if (eventTag) { this.renderTagBadge(content, eventTag); }
      if (type === 'vacation') { this.renderVacationBadge(content, status); }
    }
  }

  renderUserBadge(content: Element, user: User): void {
    const span = document.createElement('span');
    span.innerText = `${user.surname} ${user.name[0]}.`;
    span.className = 'margin-r-5 label label-info';

    const img = document.createElement('img');
    img.src = user.avatar.thumbnail;
    img.className = 'user-image-event';
    span.prepend(img);
    content.prepend(span);
  }

  renderTagBadge(content: Element, eventTag: EventTag): void {
    const span = document.createElement('span');
    span.innerText = eventTag.name;
    span.className = 'margin-r-5 label label-warning';
    content.prepend(span);
  }

  renderVacationBadge(content: Element, status: string): void {
    const classNames = ['margin-r-5', 'label'];
    const span = document.createElement('span');
    span.innerText = new CalendarEvent({ status }).textStatus();
    span.className = 'margin-r-5 label';
    if (status === 'draft') {
      classNames.push('label-danger');
    } else if (status === 'approved') {
      classNames.push('label-warning');
    } else { classNames.push('label-default'); }

    span.className = classNames.join(' ');
    content.prepend(span);
  }
}
