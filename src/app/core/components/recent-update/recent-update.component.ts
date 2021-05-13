import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import { UpdateService } from '../../services';
import { UpdateFilter, Update } from '../../models';

@Component({
  selector: 'app-recent-update',
  templateUrl: './recent-update.component.html',
  styleUrls: ['./recent-update.component.scss']
})
export class RecentUpdateComponent implements OnInit {
  @Input()
  private userId: number;
  private updateFilter = new UpdateFilter();
  public lastUpdate: Update;

  constructor(private updateService: UpdateService) {}

  ngOnInit() {
    this.updateFilter.userIds = [this.userId];
    this.updateFilter.limit = 1;

    this.updateService
      .getUpdates(this.updateFilter)
      .subscribe(data => {
        this.lastUpdate = data.updates.length
          ? data.updates[0] : null;
      });
  }

  public showDate(strDate: string, format: string): string {
    return moment(strDate).format(format);
  }

}
