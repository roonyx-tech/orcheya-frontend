import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit = 20, completedWord = false, trail = '...'): string {
    if (completedWord && value.includes(' ') && value.length > limit) {
      limit = value.substring(0, limit).lastIndexOf(' ');
    }
    return value.length > limit ? `${value.substr(0, limit)}${trail}` : value;
  }

}
