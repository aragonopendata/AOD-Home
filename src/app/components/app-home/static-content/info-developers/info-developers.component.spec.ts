import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDevelopersComponent } from './info-developers.component';

describe('InfoDevelopersComponent', () => {
  let component: InfoDevelopersComponent;
  let fixture: ComponentFixture<InfoDevelopersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoDevelopersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoDevelopersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
