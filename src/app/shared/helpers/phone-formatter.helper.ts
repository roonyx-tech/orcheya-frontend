import { AbstractControl } from '@angular/forms';
import { format, parseNumber, AsYouType } from 'libphonenumber-js';

export const formatNumber = (value: string, phoneControl: AbstractControl) => {
  if (!value) { return; }

  let phone = value.trim();
  const parsedPhone  = parseNumber(phone);

  if (phone && !phone.match(/(^\+)|(^\s\+)/)) {
    phone = `+${phone}`;
    phoneControl.patchValue(phone);
  } else if ('phone' in parsedPhone) {
    const result = format(parsedPhone, 'International');
    const formattedResult = result.split(' ').map((item, index) => {
      if (index === 1) {
        return ` (${item})`;
      } else if (index > 2) {
        return `-${item}`;
      } else {
        return ` ${item}`;
      }
    }).join('').trim();
    phoneControl.patchValue(formattedResult);
  } else {
    const formattedResult = new AsYouType().input(phone);
    phoneControl.patchValue(formattedResult);
  }
};
