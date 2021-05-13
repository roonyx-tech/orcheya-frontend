import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { RouterModule } from '@angular/router';
import { SidebarService } from './sidebar.service';
import { IMenuGroup } from './menu-group.interface';

class SidebarServiceStub { }

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      providers: [
        { provide: SidebarService, useValue: SidebarServiceStub }
      ],
      imports: [RouterModule.forRoot([], { relativeLinkResolution: 'legacy' })]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('currentGroup should be defined', () => {
    expect(component.currentGroup).toBeUndefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleGroup()', () => {
    const menuGroupStub: IMenuGroup = { name: '', icon: '', single: true };

    it('should be defined', () => {
      expect(component.toggleGroup).toBeDefined();
    });

    it(
      'should contain the current selected menu group',
      () => {
      component.currentGroup = null;
      component.toggleGroup(menuGroupStub);
      expect(component.currentGroup).toBe(menuGroupStub);
    });

    it('should close tab if it is already opened', () => {
      component.currentGroup = menuGroupStub;
      component.toggleGroup(menuGroupStub);
      expect(component.currentGroup).toBeNull();
    });
  });

});
