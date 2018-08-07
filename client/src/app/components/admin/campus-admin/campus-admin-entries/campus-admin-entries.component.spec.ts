import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusAdminEntriesComponent } from './campus-admin-entries.component';

describe('CampusAdminEntriesComponent', () => {
  let component: CampusAdminEntriesComponent;
  let fixture: ComponentFixture<CampusAdminEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampusAdminEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusAdminEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
