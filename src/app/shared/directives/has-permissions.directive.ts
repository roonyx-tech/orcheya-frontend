import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { CurrentUserService } from '../../core/services';

@Directive({
  selector: '[appHasPermissions]'
})
export class HasPermissionsDirective {
  private permissions: string | Array<string>;
  private viewRef = null;
  private templateRef = null;

  @Input()
  set appHasPermissions(permissions: string | Array<string>) {
    this.permissions = permissions;
    this.viewRef = null;
    this.init();
  }

  constructor(private tmpRef: TemplateRef<any>,
              private viewContainerRef: ViewContainerRef,
              private currentUser: CurrentUserService) {
    this.templateRef = tmpRef;
  }

  public init(): void {
    if (!this.permissions || this.currentUser.hasPermissions(this.permissions)) {
      this.viewRef = this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
