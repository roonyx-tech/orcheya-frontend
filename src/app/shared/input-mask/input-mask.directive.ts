import {
  Directive, HostListener, Input,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { formatNumber } from '../helpers/phone-formatter.helper';

@Directive({
  selector: 'input[appMask]'
})
export class InputMaskDirective {

  @Input() appMask: FormControl;

  constructor() {}

  @HostListener('input', ['$event.target.value'])

  public onChange(event): void {
    formatNumber(event, this.appMask);
  }
}
