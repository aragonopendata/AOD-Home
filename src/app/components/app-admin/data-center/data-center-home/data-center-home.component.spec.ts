import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCenterHomeComponent } from './data-center-home.component';

describe('DataCenterHomeComponent', () => {
  let component: DataCenterHomeComponent;
  let fixture: ComponentFixture<DataCenterHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCenterHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCenterHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
