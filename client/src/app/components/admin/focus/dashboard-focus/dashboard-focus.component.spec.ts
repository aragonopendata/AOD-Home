import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFocusComponent } from './dashboard-focus.component';

describe('DashboardFocusComponent', () => {
  let component: DashboardFocusComponent;
  let fixture: ComponentFixture<DashboardFocusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFocusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFocusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
