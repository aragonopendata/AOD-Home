/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AodCoreAdminService } from './aod-core-admin.service';

describe('Service: AodCoreAdmin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AodCoreAdminService]
    });
  });

  it('should ...', inject([AodCoreAdminService], (service: AodCoreAdminService) => {
    expect(service).toBeTruthy();
  }));
});