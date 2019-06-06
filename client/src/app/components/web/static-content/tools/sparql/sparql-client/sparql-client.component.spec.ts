import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparqlClientComponent } from './sparql-client.component';

describe('SparqlClientComponent', () => {
  let component: SparqlClientComponent;
  let fixture: ComponentFixture<SparqlClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparqlClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparqlClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
