import { Model } from 'tsmodels';
import { HttpParams } from '@angular/common/http';

export class FilterHttpHelper {
  public static getQueryStrByFilter(filter: Model): string {
    let str = '?';

    if (filter && '_toJSON' in filter) {
      const obj = filter._toJSON() as any;

      if (obj.id) {
        delete(obj.id);
      }

      for (const key in obj) {
        if (obj.hasOwnProperty(key) && (
            obj[key] === undefined || obj[key] === null)
        ) {
          delete(obj[key]);
        }
      }

      Object.keys(obj).forEach(key => {
        if (Array.isArray(obj[key])) {
          (obj[key] as Array<string>).forEach(id => {
            str += key + '[]=' + id + '&';
          });
        } else {
          str += key + '=' + obj[key] + '&';
        }
      });
    }

    return str.slice(0, -1);
  }

  public static getArrayQueryString(
    name: string,
    array: Array<string | number>
  ): string {
    let params = new HttpParams();

    array.forEach(value => {
      params = params.append(`${name}[]`, String(value));
    });
    return params.toString();
  }
}
