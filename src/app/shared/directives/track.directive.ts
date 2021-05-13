import { Directive, HostListener, Input } from '@angular/core';
import { TrackService } from '../services/track.service';

@Directive({
  selector: '[appTrack]'
})
export class TrackDirective {
  constructor(private trackService: TrackService) { }
  @Input() appTrack: string;

  @HostListener('click', ['$event'])
  clickEvent(event) {
    this.trackService.track(this.appTrack);
  }
}
