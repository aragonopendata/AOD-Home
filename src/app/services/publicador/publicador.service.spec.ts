import { TestBed, inject } from '@angular/core/testing';

import { PublicadorService } from './publicador.service';

describe('PublicadorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicadorService]
    });
  });

  it('should be created', inject([PublicadorService], (service: PublicadorService) => {
    expect(service).toBeTruthy();
  }));
});
