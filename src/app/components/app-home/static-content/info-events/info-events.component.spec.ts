import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoEventsComponent } from './info-events.component';

describe('InfoEventsComponent', () => {
  let component: InfoEventsComponent;
  let fixture: ComponentFixture<InfoEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
