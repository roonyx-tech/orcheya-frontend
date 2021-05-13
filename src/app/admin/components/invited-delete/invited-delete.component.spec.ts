import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvitedDeleteComponent } from './invited-delete.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CurrentUserService } from '@core-services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OnboardingService } from '@admin-services';

describe('InvitedDeleteComponent', () => {
  let component: InvitedDeleteComponent;
  let fixture: ComponentFixture<InvitedDeleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [ InvitedDeleteComponent ],
      providers: [ BsModalRef, CurrentUserService, OnboardingService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitedDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
