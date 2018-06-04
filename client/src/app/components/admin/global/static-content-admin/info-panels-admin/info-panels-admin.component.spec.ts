import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPanelsAdminComponent } from './info-panels-admin.component';

describe('InfoPanelsAdminComponent', () => {
  let component: InfoPanelsAdminComponent;
  let fixture: ComponentFixture<InfoPanelsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoPanelsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
