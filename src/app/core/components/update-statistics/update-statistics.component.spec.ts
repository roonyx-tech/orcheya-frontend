import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { UpdateService } from '@core-services';

import { UpdateStatisticsComponent } from './update-statistics.component';

describe('UpdateStatisticsComponent', () => {
  let component: UpdateStatisticsComponent;
  let fixture: ComponentFixture<UpdateStatisticsComponent>;
  const colsLength = 2;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([], { relativeLinkResolution: 'legacy' })
      ],
      declarations: [ UpdateStatisticsComponent ],
      providers: [ UpdateService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create table', () => {
    const table = fixture.debugElement.queryAll(By.css('table'));
    expect(table.length).toBe(1);
    const thead = fixture.debugElement.queryAll(By.css('thead'));
    expect(thead.length).toBe(1);
    const headers = fixture.debugElement.queryAll(By.css('th'));
    expect(headers.length).toBe(colsLength);
    const tbody = fixture.debugElement.queryAll(By.css('tbody'));
    expect(tbody.length).toBe(1);
  });
});
