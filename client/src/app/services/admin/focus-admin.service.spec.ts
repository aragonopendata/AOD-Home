import { TestBed, inject } from '@angular/core/testing';

import { FocusAdminService } from './focus-admin.service';

describe('FocusAdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FocusAdminService]
    });
  });

  it('should be created', inject([FocusAdminService], (service: FocusAdminService) => {
    expect(service).toBeTruthy();
  }));
});
