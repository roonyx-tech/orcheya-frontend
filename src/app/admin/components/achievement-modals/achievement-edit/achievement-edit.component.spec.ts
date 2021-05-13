/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AchievementEditComponent } from './achievement-edit.component';
import { RolesService, UsersService, FaqService } from '@admin-services';
import { NotifierService, NotifierModule } from 'angular-notifier';

describe('AchievementEditComponent', () => {
  let component: AchievementEditComponent;
  let fixture: ComponentFixture<AchievementEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot(),
        HttpClientTestingModule,
        NotifierModule,
      ],
      declarations: [ AchievementEditComponent ],
      providers: [
        BsModalRef,
        BsModalService,
        RolesService,
        UsersService,
        NotifierService,
        FaqService
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AchievementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
