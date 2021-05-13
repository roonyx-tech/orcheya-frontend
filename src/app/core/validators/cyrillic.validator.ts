import { AbstractControl } from '@angular/forms';

export function ValidateCyrillic(control: AbstractControl) {
  const regex = /^[/[а-яА-ЯЁё ]+$/;
  if (control.value === null) {
    return null;
  } else {
    return !control.value.match(regex) ? { validCyrillic: true } : null;
  }
}
