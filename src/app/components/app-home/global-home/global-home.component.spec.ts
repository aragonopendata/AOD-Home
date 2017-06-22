import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalHomeComponent } from './global-home.component';

describe('GlobalHomeComponent', () => {
  let component: GlobalHomeComponent;
  let fixture: ComponentFixture<GlobalHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
