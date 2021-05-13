import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SectionEditComponent } from './section-edit.component';
import { FaqService } from '@admin-services';
import { FormBuilder } from '@angular/forms';

describe('SectionEditComponent', () => {
  let component: SectionEditComponent;
  let fixture: ComponentFixture<SectionEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot(),
        HttpClientTestingModule
      ],
      declarations: [ SectionEditComponent ],
      providers: [
        BsModalRef,
        BsModalService,
        FormBuilder,
        FaqService
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
