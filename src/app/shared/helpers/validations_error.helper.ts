import { humanize } from './humanize.helper';

export const validationMessage = (response: any): string => {
  const msg = [];
  Object.keys(response.error).forEach((key: string) => {
    const values = response.error[key];
    if (Array.isArray(values)) {
      msg.push(`${humanize(key)}: ${values.join(', ')}`);
    } else {
      msg.push(`${humanize(key)}: ${values}`);
    }
  });

  return msg.join('\n');
};
