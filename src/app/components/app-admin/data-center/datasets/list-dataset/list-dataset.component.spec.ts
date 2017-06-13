import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDatasetComponent } from './list-dataset.component';

describe('ListDatasetComponent', () => {
  let component: ListDatasetComponent;
  let fixture: ComponentFixture<ListDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDatasetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
