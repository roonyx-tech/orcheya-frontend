import { AbstractControl } from '@angular/forms';

export function ValidateLatin(control: AbstractControl) {
  const regex = /^\w+$/;
  if (control.value === null) {
    return null;
  } else {
    return !control.value.match(regex) ? { validLatin: true } : null;
  }
}
