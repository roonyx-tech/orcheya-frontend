import { Injectable } from '@angular/core';
import { IMenuGroup } from './menu-group.interface';
import { CurrentUserService } from '../../core/services';
import { IMenuItem } from './menu-item.interface';

@Injectable()
export class SidebarService {
  public menu: IMenuGroup[] = [];

  constructor(private currentUserService: CurrentUserService) {}

  public add(group: IMenuGroup[] | IMenuGroup): void {
    if (Array.isArray(group)) {
      group.forEach(singleGroup => this.append(singleGroup));
    } else {
      this.append(group);
    }
  }

  private hasGroup(group: IMenuGroup): boolean {
    return !!this.menu.find(x => x.name === group.name);
  }

  private allow(group: IMenuGroup): boolean {
    return !group.permissions || this.currentUserService.hasPermissions(group.permissions);
  }

  private hasAllowedItems(group: IMenuGroup): boolean {
    if (!group.items) { return true; }
    group.items = group.items.filter((item: IMenuItem) => {
      return !item.permissions || this.currentUserService.hasPermissions(item.permissions);
    });
    return group.items.length > 0;
  }

  private append(group: IMenuGroup) {
    if (!this.hasGroup(group) && this.allow(group) && this.hasAllowedItems(group)) {
      this.menu.push(group);
    }
  }
}
