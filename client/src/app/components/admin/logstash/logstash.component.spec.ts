/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LogstashComponent } from './logstash.component';

describe('LogstashComponent', () => {
  let component: LogstashComponent;
  let fixture: ComponentFixture<LogstashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogstashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogstashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
