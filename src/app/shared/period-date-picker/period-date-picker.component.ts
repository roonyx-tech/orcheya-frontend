import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as moment from 'moment';
import { DATEPICKER_CONFIG } from './date-picker-config';

@Component({
  selector: 'app-period-date-picker',
  templateUrl: './period-date-picker.component.html',
  styleUrls: ['./period-date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PeriodDatePickerComponent),
      multi: true
    }
  ]
})
export class PeriodDatePickerComponent implements ControlValueAccessor {

  @Input() public periodUnit: moment.unitOfTime.DurationConstructor = 'week';

  public dates: Array<Date> = null;
  public bsConfig = DATEPICKER_CONFIG;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private cdr: ChangeDetectorRef) { }

  public registerOnChange(fn): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn): void {
    this.onTouched = fn;
  }

  public writeValue(obj: any): void {
    this.dates = obj;
  }

  public valueChanged(newValue: Array<Date>): void {
    const changedNull = (!newValue || !this.dates) && newValue !== this.dates;
    const changedNotNull = newValue && this.dates &&
      (newValue[0] !== this.dates[0] || newValue[1] !== this.dates[1]);
    const shouldUpdate = changedNull || changedNotNull;

    if (shouldUpdate) {
      this.dates = newValue;
      this.onChange(newValue);
      this.cdr.detectChanges();
    }
  }

  private _mutateDates(ammount: number): void {
    const dates = [];
    for (const date of this.dates) {
      dates.push(moment(date).add(ammount, this.periodUnit).toDate());
    }
    this.dates = dates;
    this.onChange(dates);
  }

  public addTime(): void {
    this._mutateDates(1);
  }

  public subtractTime(): void {
    this._mutateDates(-1);
  }
}

