import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ScrollService {
  public scrollPage = new BehaviorSubject<Event>(null);
}
