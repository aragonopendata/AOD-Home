/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LogstashService } from './logstash.service';

describe('Service: Logstash', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogstashService]
    });
  });

  it('should ...', inject([LogstashService], (service: LogstashService) => {
    expect(service).toBeTruthy();
  }));
});