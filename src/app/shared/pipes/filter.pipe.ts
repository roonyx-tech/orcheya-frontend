import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: any[],
            field: string,
            value: any,
            revert: boolean = false): any[] {
    if (!items) {
      return [];
    }

    if (revert) {
      return items.filter(x => x[field] !== value);
    } else {
      return items.filter(x => x[field] === value);
    }
  }
}
