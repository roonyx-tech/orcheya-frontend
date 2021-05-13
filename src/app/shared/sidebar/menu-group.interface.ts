import { IMenuItem } from './menu-item.interface';

export interface IMenuGroup {
  name: string;
  icon: string;
  single: boolean;
  link?: any[string|number];
  items?: IMenuItem[];
  permissions?: string | string[];
}
