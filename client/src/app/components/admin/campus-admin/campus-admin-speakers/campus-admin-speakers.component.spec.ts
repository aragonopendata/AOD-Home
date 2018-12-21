import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusAdminSpeakersComponent } from './campus-admin-speakers.component';

describe('CampusAdminSpeakersComponent', () => {
  let component: CampusAdminSpeakersComponent;
  let fixture: ComponentFixture<CampusAdminSpeakersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampusAdminSpeakersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusAdminSpeakersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
