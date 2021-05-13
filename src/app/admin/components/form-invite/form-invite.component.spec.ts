import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormInviteComponent } from './form-invite.component';
import { OnboardingService, RolesService } from '@admin-services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';

describe('FormInviteComponent', () => {
  let component: FormInviteComponent;
  let fixture: ComponentFixture<FormInviteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ModalModule.forRoot(),
      ],
      declarations: [ FormInviteComponent ],
      providers: [
        RolesService,
        OnboardingService,
        BsModalService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
