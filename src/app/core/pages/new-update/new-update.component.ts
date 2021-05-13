import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Worklog, Update } from '@models';
import {
  NewUpdateService,
  CurrentUserService
} from '@core-services';

@Component({
  selector: 'app-new-update',
  templateUrl: './new-update.component.html',
  styleUrls: ['./new-update.component.scss']
})
export class NewUpdateComponent implements OnInit, OnDestroy {
  private subsription: Subscription;
  public previousUpdate;
  public promisedList: string[];
  public doneTodayTasks: Array<Worklog>;
  public isAllowedToSendUpdate: boolean;
  public updateDate: string;

  public update = new Update({
    made: '',
    planning: '',
    issues: '',
  });

  constructor(
    private newUpdateService: NewUpdateService,
    private activatedRoute: ActivatedRoute,
    public currentUser: CurrentUserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subsription = this.activatedRoute.queryParams
      .subscribe((params: Params) => {
        this.updateDate = params.date || new Date();
        this.update.date = this.updateDate;
      });
    this.checkIsUpdateAllowed();
    if (this.isAllowedToSendUpdate) {
      this.newUpdateService.getLastUpdate(
        this.currentUser.id, this.updateDate
      ).subscribe(response => {
        this.previousUpdate = response.prev_update;
        if (this.previousUpdate) {
          this.promisedList = this.previousUpdate.planning.split(/^\s*-?\s*/).filter(str => str);
        } else { this.promisedList = []; }

        this.doneTodayTasks = response.worked;
        this.doneTodayTasks.forEach((task: Worklog, index: number) => {
          if (this.doneTodayTasks.length - 1 > index) {
            this.update.made += `${task.title}\n`;
          } else {
            this.update.made += task.title;
          }
        });
        this._initUpdate(response.current_update);
      });
    }
  }

  ngOnDestroy() {
    this.subsription.unsubscribe();
  }

  private _initUpdate(data: Update | undefined) {
    if (data) {
      this.update = data;
    }
  }

  public checkIsUpdateAllowed(): void {
    const updateDate = new Date(this.updateDate);
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate.getTime() - updateDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.isAllowedToSendUpdate = diffDays <= 2;
  }

  public sendUpdate(): void {
    if (this.update.id) {
      this.newUpdateService.editOldUpdate(this.update)
        .subscribe(() => {
          this.router.navigate(['/profile']);
        });
    } else {
      this.newUpdateService.sendNewUpdate(this.update)
        .subscribe(() => {
          this.router.navigate(['/profile']);
        });
    }
  }
}
