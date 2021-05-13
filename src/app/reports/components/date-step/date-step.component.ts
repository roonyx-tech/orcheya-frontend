import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-date-step',
  templateUrl: './date-step.component.html'
})

export class DateStepComponent {
  @Input() public step: string;
  @Output() public changeStep = new EventEmitter<string>();

  constructor() {}

  public setStep(step: string): void {
    this.step = step;
    this.changeStep.emit(step);
  }
}
