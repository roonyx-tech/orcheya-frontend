import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null) {
      return '0m';
    }
    const hours = Math.floor(value / 3600);
    const minutes = value % 60;
    const hour = (hours > 1) ? hours + 'h ' : hours + 'h ';
    const min = (minutes > 0) ? minutes + 'm' : '';
    return hour + min;
  }
}
