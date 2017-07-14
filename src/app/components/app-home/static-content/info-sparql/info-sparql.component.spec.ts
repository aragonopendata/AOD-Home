import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSparqlComponent } from './info-sparql.component';

describe('InfoSparqlComponent', () => {
  let component: InfoSparqlComponent;
  let fixture: ComponentFixture<InfoSparqlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSparqlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSparqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
