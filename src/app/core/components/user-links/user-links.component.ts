import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserLinksService } from '../../services';
import { UserLink } from '../../models';
import { SERVICES } from './allowed-services';
import { CurrentUserService } from '../../services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-user-links',
  templateUrl: './user-links.component.html',
  styleUrls: ['./user-links.component.scss']
})
export class UserLinksComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public userLinks: FormArray;
  private subscriptions: Subscription[] = [];
  public kinds = [];
  @ViewChildren('myInput') myInput: QueryList<any>;

  constructor(
    private fb: FormBuilder,
    private linksService: UserLinksService,
    private currentUser: CurrentUserService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      userLinks: this.fb.array([]),
    });
    this.linksService.links.subscribe((links: UserLink[]) => {
      if (links.length > 0) {
        links.forEach((link: UserLink, index: number) => {
          this.addLink(link);
          this.kinds[index] = link.kind;
        });
      } else {
        this.addLink();
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private _createLinkFormGroup(userLink?: UserLink): FormGroup {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/+@\\w .-]*/?';
    return this.fb.group({
      link: [
        userLink ? userLink.link : '',
        [Validators.pattern(reg)],
      ],
      id: userLink ? userLink.id : null,
    });
  }

  public addLink(userLink?: UserLink): void {
    this.userLinks = this.form.get('userLinks') as FormArray;
    this.userLinks.push(this._createLinkFormGroup(userLink));
    const index = this.userLinks.controls.length - 1;
    const newInput = this.userLinks.controls[index];
    this.subscriptions.push(
      newInput
        .valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((changedInput: UserLink) => {
          const formControlIndex = this._findUserLinkIndex(changedInput);
          if (this.userLinks.controls[formControlIndex].valid) {
            if (changedInput.id !== null) {
              this._updateUserLinks(changedInput, index);
            } else {
              this._createUserLinks(changedInput, index);
            }
          }
        })
    );
  }

  private _findUserLinkIndex(changedControlValue: UserLink): number {
    let controlIndex;
    this.userLinks.controls
      .forEach((control: AbstractControl, index: number) => {
        if (control.value === changedControlValue) {
          controlIndex = index;
        }
      });
    return controlIndex;
  }

  public removeUserLink(index: number): void {
    const linkId = this.userLinks.controls[index].value.id;
    const formArray = this.form.controls.userLinks as FormArray;
    if (formArray.controls.length > 0) {
      formArray.removeAt(index);
    }
    this.kinds.splice(index, 1);
    if (linkId !== null) {
      this.linksService
        .removeUserLink(linkId, this.currentUser.id, index)
        .subscribe();
    }
    this.subscriptions[index].unsubscribe();
  }

  private _createUserLinks(link: UserLink, index: number): void {
    this.linksService.newUserLink(link, this.currentUser.id)
      .subscribe((response: UserLink) => {
        this.userLinks.controls[index]
          .patchValue({
            id: response.id,
            kind: response.kind,
          });
      });
  }

  private _updateUserLinks(link: UserLink, index: number): void {
    this.linksService.updateUserLink(link, this.currentUser.id)
      .subscribe((response: UserLink) => {
        this.kinds[index] = response.kind;
      });
  }

  public makeIconClassName(kind: string): string {
    return SERVICES[kind] ? `fa-${SERVICES[kind].icon}` : 'fa-link';
  }

  public setFocusOnInput(): void {
    setTimeout(() => {
      this.myInput.last.nativeElement.focus();
    }, 0);
  }
}
