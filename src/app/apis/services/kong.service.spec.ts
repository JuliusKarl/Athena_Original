import { TestBed, inject } from '@angular/core/testing';

import { KongService } from './kong.service';

describe('KongService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KongService]
    });
  });

  it('should be created', inject([KongService], (service: KongService) => {
    expect(service).toBeTruthy();
  }));
});
