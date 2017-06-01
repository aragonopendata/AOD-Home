import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalAdminHomeComponent } from './global-admin-home.component';

describe('GlobalAdminHomeComponent', () => {
  let component: GlobalAdminHomeComponent;
  let fixture: ComponentFixture<GlobalAdminHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalAdminHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalAdminHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
