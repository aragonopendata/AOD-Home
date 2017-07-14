import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CooperateComponent } from './cooperate.component';

describe('CooperateComponent', () => {
  let component: CooperateComponent;
  let fixture: ComponentFixture<CooperateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CooperateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CooperateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
