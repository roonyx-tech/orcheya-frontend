import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChartServiceComponent } from './chart-service.component';

describe('ChartServiceComponent', () => {
  let component: ChartServiceComponent;
  let fixture: ComponentFixture<ChartServiceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
