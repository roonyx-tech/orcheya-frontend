import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FaqService } from '@core-services';

import { FaqSectionsComponent } from './faq-sections.component';

describe('FaqSectionsComponent', () => {
  let component: FaqSectionsComponent;
  let fixture: ComponentFixture<FaqSectionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [ FaqSectionsComponent ],
      providers: [ FaqService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
