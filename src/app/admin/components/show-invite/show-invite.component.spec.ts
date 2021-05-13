import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShowInviteComponent } from './show-invite.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierModule } from 'angular-notifier';

describe('ShowInviteComponent', () => {
  let component: ShowInviteComponent;
  let fixture: ComponentFixture<ShowInviteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NotifierModule
      ],
      declarations: [ ShowInviteComponent ],
      providers: [ BsModalRef ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
