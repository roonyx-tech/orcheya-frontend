import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { LoadingComponent } from './loading.component';

@Directive({
  selector: '[appLoading]'
})
export class LoadingDirective {
  public loadingFactory: ComponentFactory<LoadingComponent>;
  public loadingComponent: ComponentRef<LoadingComponent>;
  private viewRef: EmbeddedViewRef<any>;

  @Input()
  set appLoading(loading: boolean) {
    if (loading && !this.loadingComponent) {
      this.loadingComponent = this.vcRef.createComponent(this.loadingFactory);
    }
    if (!loading && this.loadingComponent) {
      this.loadingComponent.destroy();
      this.loadingComponent = null;
    }
    if (!this.viewRef) {
      this.viewRef = this.vcRef.createEmbeddedView(this.templateRef);
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private vcRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.loadingFactory = this.componentFactoryResolver
      .resolveComponentFactory(LoadingComponent);
  }
}
