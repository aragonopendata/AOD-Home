import { TestBed, inject } from '@angular/core/testing';

import { SysAdminService } from './sys-admin.service';

describe('SysAdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SysAdminService]
    });
  });

  it('should be created', inject([SysAdminService], (service: SysAdminService) => {
    expect(service).toBeTruthy();
  }));
});
