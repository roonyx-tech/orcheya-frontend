import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'humanizeDate'
})
export class HumanizeDatePipe implements PipeTransform {
  transform(value: Date | string): string {
    return moment(value).format('DD MMMM YYYY');
  }
}
