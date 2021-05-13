import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import * as moment from 'moment';
import {
  DurationInputArg1,
  DurationInputArg2
} from 'moment';

export interface DateRangeOutput {
  count: DurationInputArg1;
  kind: DurationInputArg2;
  dates: Date[];
}

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html'
})

export class DateRangeComponent implements OnInit {
  @Input() public count: DurationInputArg1;
  @Input() public kind: DurationInputArg2;
  @Output() public changeDates = new EventEmitter<DateRangeOutput>();

  constructor() {}

  ngOnInit() {
    this.setDates(this.count, this.kind);
  }

  public setDates(
    count: DurationInputArg1 | undefined, kind: DurationInputArg2 | undefined
  ): void {
    this.count = count;
    this.kind = kind;
    const copyKind = kind === 'week' ? 'isoWeek' : kind;
    if (this.count && this.kind) {
      const dates = [
        moment().endOf(copyKind).subtract(count, kind).add(1, 'day').toDate(),
        moment().endOf(copyKind).toDate()
      ];
      this.changeDates.emit({
        count: this.count,
        kind: this.kind,
        dates
      });
    }
  }
}
