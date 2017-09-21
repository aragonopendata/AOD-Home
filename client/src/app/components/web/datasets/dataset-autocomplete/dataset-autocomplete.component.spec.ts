import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetAutocompleteComponent } from './dataset-autocomplete.component';

describe('DatasetAutocompleteComponent', () => {
  let component: DatasetAutocompleteComponent;
  let fixture: ComponentFixture<DatasetAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
