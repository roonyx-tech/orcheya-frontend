import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services';
import { Role } from '@models';
import { RoleEditComponent, RoleDeleteComponent } from '../../components';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CurrentUserService } from '@core-services';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  public roles: Role[];
  public role: Role = new Role();

  constructor(private rolesService: RolesService,
              private currentUser: CurrentUserService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.rolesService.getRolesList().subscribe(x => this.roles = x);
  }

  public remove(role: Role): void {
    const initialState = { role, roles: this.roles };

    const modal = this.modalService.show(RoleDeleteComponent, { initialState });

    modal.content.onRoleDelete.subscribe(data => {
      if (data.newed) {
        this.roles.find(r => r === data.newed).usersCount += data.deleted.usersCount;
      }
      this.roles.splice(this.roles.findIndex(r => r === role), 1);
      modal.hide();
    });
  }

  public addRole(): void {
    const initialState = { role: new Role() };
    const modal = this.modalService.show(RoleEditComponent, { initialState });
    modal.content.onRoleUpdate.subscribe((x: Role) => {
      x.usersCount = 0;
      this.roles.unshift(x);
      modal.hide();
    });
  }

  public editRole(role: Role): void {
    const initialState = { role };
    const modal = this.modalService.show(RoleEditComponent, { initialState });
    modal.content.onRoleUpdate.subscribe((x: Role) => {
      x.usersCount = role.usersCount;
      role._fromJSON(x._toJSON());
      this.roles.splice(this.roles.indexOf(role), 1, x);
      modal.hide();
    });
  }
}
