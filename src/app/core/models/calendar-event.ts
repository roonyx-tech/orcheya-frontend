import { Alias, Model  } from 'tsmodels';
import { User } from './user';
import { Project } from './project';

export class EventTag {
  public id: number;
  public name: string;
  public uid: string;
}
export class CalendarEvent extends Model {
  @Alias() public id?: number;
  @Alias() public title: string;
  @Alias() public type: string;
  @Alias() public description: string;
  @Alias('started_at') public start: Date;
  @Alias('ended_at') public end: Date;
  @Alias('all_day') public allDay: boolean;
  @Alias('event_tag') public eventTag: EventTag;
  @Alias('event_tag_id') public eventTagId: number;
  @Alias('project_id') public projectId: number;
  @Alias('project', Project) public project: Project;
  @Alias('user_id') public userId: number;
  @Alias('status') public status: string;
  @Alias('user', User) public user: User;


  constructor(event?: object) {
    super();

    if (!event) {
      return;
    }

    Object.keys(event).forEach(key => {
      if (event[key]) {
        this[key] = event[key];
      }
    });
  }

  textStatus(): string {
    if (this.status === 'draft') {
      return 'New';
    } else if (this.status) {
      return this.status.charAt(0).toUpperCase() + this.status.substring(1);
    } else {
      return 'None';
    }
  }

  labelClass(): any {
    return {
      'label-warning': this.status === 'draft',
      'label-success': this.status === 'approved',
      'label-danger': this.status === 'canceled',
      'label-default': this.status === 'done',
    };
  }
}
