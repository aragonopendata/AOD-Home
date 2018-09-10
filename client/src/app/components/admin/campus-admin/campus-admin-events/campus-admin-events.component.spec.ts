import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusAdminEventsComponent } from './campus-admin-events.component';

describe('CampusAdminEventsComponent', () => {
  let component: CampusAdminEventsComponent;
  let fixture: ComponentFixture<CampusAdminEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampusAdminEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusAdminEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
