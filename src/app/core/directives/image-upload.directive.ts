import {
  Directive, ElementRef, EventEmitter,
  Input, OnInit, Output, Renderer2
} from '@angular/core';

@Directive({
  selector: 'img[appImageUpload]',
  exportAs: 'appImageUpload'
})
export class ImageUploadDirective implements OnInit {
  @Output() public fileChange = new EventEmitter<File>();
  @Input() private disable = false;
  private input: HTMLInputElement;
  private parent: Element;
  private panel: Element;
  private cssClasses = {
    parent: 'relative',
    panel: 'appImageUpload',
    icon: 'fa fa-upload',
  };
  private text = { span: 'Upload photo' };

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
  ) {}

  ngOnInit() {
    if (this.disable) {
      return;
    }

    this.parent = this.renderer.parentNode(this.elRef.nativeElement);
    this.renderer.addClass(this.parent, this.cssClasses.parent);

    this.panel = this.createPanel();
    this.renderer.appendChild(this.parent, this.panel);

    this.renderer.listen(
      this.parent, 'mouseenter', this.onMouseEnter.bind(this)
    );

    this.renderer.listen(
      this.parent, 'mouseleave', this.onMouseLeave.bind(this)
    );

    this.renderer.listen(
      this.panel, 'click', this.onClick.bind(this)
    );

    this.renderer.listen(
      this.input, 'change', this.onChange.bind(this)
    );
  }

  private createPanel(): Element {
    const panel = this.renderer.createElement('div');
    const icon = this.renderer.createElement('i');
    const span = this.renderer.createElement('span');

    this.input = this.renderer.createElement('input');
    this.renderer.setAttribute(this.input, 'type', 'file');
    this.renderer.setAttribute(this.input, 'style', 'display: none');

    this.cssClasses.panel.split(' ')
      .forEach(cssClass => this.renderer.addClass(panel, cssClass));

    this.cssClasses.icon.split(' ')
      .forEach(cssClass => this.renderer.addClass(icon, cssClass));

    this.renderer.appendChild(
      span,
      this.renderer.createText(` ${this.text.span}`),
    );

    this.renderer.appendChild(panel, icon);
    this.renderer.appendChild(panel, span);
    this.renderer.appendChild(panel, this.input);

    return panel;
  }

  private onMouseEnter() {
    this.renderer.addClass(this.panel, 'open');
    this.renderer.setStyle(
      this.elRef.nativeElement, 'filter', 'brightness(65%)'
    );
  }

  private onMouseLeave() {
    this.renderer.removeClass(this.panel, 'open');
    this.renderer.removeStyle(
      this.elRef.nativeElement, 'filter'
    );
  }

  private onClick() {
    this.input.click();
  }

  private onChange() {
    if (this.input.files.length) {
      this.fileChange.emit(this.input.files.item(0));
    }

    this.input.value = null;
  }
}
