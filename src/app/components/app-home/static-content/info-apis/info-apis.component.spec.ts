import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoApisComponent } from './info-apis.component';

describe('InfoApisComponent', () => {
  let component: InfoApisComponent;
  let fixture: ComponentFixture<InfoApisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoApisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoApisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
