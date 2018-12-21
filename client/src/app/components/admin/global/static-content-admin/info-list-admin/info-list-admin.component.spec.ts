import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoListAdminComponent } from './info-list-admin.component';

describe('InfoListAdminComponent', () => {
  let component: InfoListAdminComponent;
  let fixture: ComponentFixture<InfoListAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoListAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
