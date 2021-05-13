import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpErrorResponse } from '@angular/common/http';
import { Role, Permission, PermissionSubject } from '@models';
import { RolesService } from '../../services';
import { PermissionsService } from '../../services';

const collapsedSubjects = [];

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})

export class RoleEditComponent implements OnInit {
  public role: Role = {} as Role;
  public permissionSubjects: PermissionSubject[];

  public form: FormGroup;
  public onRoleUpdate: EventEmitter<Role> = new EventEmitter();

  private respErrors;

  constructor(private rolesService: RolesService,
              private permissionsService: PermissionsService,
              private formBuilder: FormBuilder,
              public bsModalRef: BsModalRef) {

  }

  public toggle(subject: PermissionSubject): void {
    const index = collapsedSubjects.indexOf(subject.name);

    if (index !== -1) {
      collapsedSubjects.splice(index, 1);
    } else { collapsedSubjects.push(subject.name); }
  }

  public isCollapsed(subject: PermissionSubject): boolean {
    return collapsedSubjects.includes(subject.name);
  }

  ngOnInit() {
    this.permissionsService.getPermissionSubjects()
      .subscribe(permissionSubjects => this.permissionSubjects = permissionSubjects);

    this.form = this.formBuilder.group({
      name: [this.role.name, [Validators.required, Validators.pattern('.*[\\S].*')]]
    });
  }

  isChecked(permission: Permission): boolean {
    return this.role.permissions && !!this.role.permissions.find(item => item.id === permission.id);
  }

  updatePermission(permission: Permission, event): void {
    if (event.target.checked) {
      if (!this.role.permissions) { this.role.permissions = []; }
      this.role.permissions.push(permission);
    } else {
      this.role.permissions = this.role.permissions.filter(item => item.id !== permission.id);
    }
  }

  public updateSettings() {
    if (this.form.invalid) { return; }

    const request = this.role.id ? this.rolesService.updateRole(this.role) : this.rolesService.createRole(this.role);
    request.subscribe(
      role => {
        this.respErrors = {};
        this.onRoleUpdate.emit(role);
      },
      (err: HttpErrorResponse) => {
        if (!err.error.status && !err.error.exception) {
          this.respErrors = err.error;
        }
      },
      () => null);
  }

  public textError(controlName: string): string {
    if (!this.hasError(controlName)) {
      return '';
    }

    if (this.form.get(controlName).errors) {
      if (this.form.get(controlName).errors.required) {
        return `${controlName} is required`;
      } else if (this.form.get(controlName).errors.pattern) {
        return `${controlName} can't be empty`;
      } else if (this.form.get(controlName).errors.email) {
        return `${controlName} is not valid email`;
      } else if (this.form.get(controlName).errors.validLatin) {
        return `${controlName} should contain only latin characters`;
      }
    }

    if (this.respErrors && this.respErrors[controlName]) {
      return this.respErrors[controlName];
    }
  }

  public hasError(controlName: string): boolean {
    return (
      (this.form.get(controlName).dirty
        && this.form.get(controlName).invalid
      ) || this.respErrors && this.respErrors[controlName]
    );
  }
}
