import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from '@models';
import { RolesService } from '../../services';

@Component({
  selector: 'app-role-delete',
  templateUrl: './role-delete.component.html',
  styleUrls: ['./role-delete.component.scss']
})

export class RoleDeleteComponent implements OnInit {
  public role: Role;
  public roles: Role[];

  public enabledRoles: Role[];
  public newRoleId: number;

  public onRoleDelete: EventEmitter<{ deleted: Role, newed: Role }> = new EventEmitter();

  public errors: string[] = null;

  constructor(private rolesService: RolesService,
              public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.enabledRoles = this.roles.filter(role => role !== this.role);
  }

  public delete() {
    const newRole = this.roles.find(r => r.id === Number(this.newRoleId));
    this.rolesService.removeRole(this.role, newRole)
      .subscribe(() => this.onRoleDelete.emit({ deleted: this.role, newed: newRole }),
        (err: HttpErrorResponse) => {
        if (err.error && err.error.base && err.error.base.length > 0) {
          this.errors = err.error.base;
        } else {
          this.errors = ['Unknown error'];
        }
      }
    );
  }
}
